import { db } from "@/db/drizzle";
import { alerts, templates } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono()
  .get("/", clerkMiddleware(), async (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json(
        {
          error: "Unauthorized",
        },
        401
      );
    }

    const data = await db
      .select({
        id: alerts.id,
        name: alerts.name,
        active: alerts.active,
        statusCode: alerts.statusCode,
        to: alerts.to,
        template: templates.name,
        time: alerts.time,
      })
      .from(alerts)
      .innerJoin(templates, eq(alerts.templateId, templates.id))
      .where(eq(alerts.userId, auth.userId));

    return c.json({ data });
  })
  .get(
    "/:id",
    zValidator("param", z.object({ id: z.string().optional() })),
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json(
          {
            error: "Missing id",
          },
          400
        );
      }

      if (!auth?.userId) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      const [data] = await db
        .select({
          id: alerts.id,
          name: alerts.name,
          statusCode: alerts.statusCode,
          to: alerts.to,
          templateId: alerts.templateId,
          time: alerts.time,
          scheduled: alerts.scheduled,
        })
        .from(alerts)
        .where(and(eq(alerts.userId, auth.userId), eq(alerts.id, id)));

      if (!data) {
        return c.json(
          {
            error: "Not found",
          },
          404
        );
      }

      return c.json({ data });
    }
  )
  .post(
    "/",
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({
        name: z.string(),
        statusCode: z.string(),
        to: z.string(),
        templateId: z.string(),
        time: z.string(),
        scheduled: z.string().optional(),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      const [data] = await db
        .insert(alerts)
        .values({
          id: createId(),
          userId: auth.userId,
          name: values.name,
          statusCode: values.statusCode,
          to: values.to,
          templateId: values.templateId,
          time: values.time,
          scheduled: values.scheduled,
        })
        .returning();

      return c.json({ data });
    }
  )
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string().optional() })),
    zValidator(
      "json",
      z.object({
        name: z.string(),
        statusCode: z.string(),
        to: z.string(),
        templateId: z.string(),
        time: z.string(),
        scheduled: z.string().optional(),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");
      const values = c.req.valid("json");

      if (!id) {
        return c.json(
          {
            error: "Missing id",
          },
          400
        );
      }

      if (!auth?.userId) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      const linkedMessagesToUpdate = db.$with("linkedMessages_to_update").as(
        db
          .select({ id: alerts.id })
          .from(alerts)
          .where(and(eq(alerts.id, id), eq(alerts.userId, auth.userId)))
      );

      const data = await db
        .with(linkedMessagesToUpdate)
        .update(alerts)
        .set({
          name: values.name,
          bodyMessage: values.bodyMessage,
          bodyEnding: values.bodyEnding,
          header: values.header,
          headerType: values.headerType,
          headerText: values.headerText,
          footer: values.footer,
          footerText: values.footerText,
          activated: values.activated,
          position: values.position,
        })
        .where(
          inArray(alerts.id, sql`(select id from ${linkedMessagesToUpdate})`)
        )
        .returning({
          id: alerts.id,
        });

      if (!data) {
        return c.json(
          {
            error: "Not found",
          },
          404
        );
      }

      return c.json({ data });
    }
  );

export default app;
