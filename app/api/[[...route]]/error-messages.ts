import { db } from "@/db/drizzle";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import bcrypt from "bcryptjs";
import {
  templateButtonTypes,
  templateCategories,
  templateFooters,
  templateHeaders,
  templateHeaderTypes,
  templateLanguages,
  errorMessages,
  templateTypes,
} from "@/db/schema";

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
        id: errorMessages.id,
        name: errorMessages.name,
        status: errorMessages.status,
        bodyMessage: errorMessages.bodyMessage,
        bodyEnding: errorMessages.bodyEnding,
        header: errorMessages.header,
        headerType: errorMessages.headerType,
        headerText: errorMessages.headerText,
        footer: errorMessages.footer,
        footerText: errorMessages.footerText,
      })
      .from(errorMessages)
      .where(eq(errorMessages.userId, auth.userId));

    if (!data) {
      return c.json(
        {
          error: "Not found",
        },
        404
      );
    }

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
          id: errorMessages.id,
          name: errorMessages.name,
          status: errorMessages.status,
          bodyMessage: errorMessages.bodyMessage,
          bodyEnding: errorMessages.bodyEnding,
          header: errorMessages.header,
          headerType: errorMessages.headerType,
          headerText: errorMessages.headerText,
          footer: errorMessages.footer,
          footerText: errorMessages.footerText,
        })
        .from(errorMessages)
        .where(
          and(eq(errorMessages.userId, auth.userId), eq(errorMessages.id, id))
        );

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
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string().optional() })),
    zValidator(
      "json",
      z.object({
        name: z.string(),
        bodyMessage: z.string(),
        bodyEnding: z.string().optional(),
        header: z.boolean(),
        headerType: z.string().optional(),
        headerText: z.string().optional(),
        footer: z.boolean(),
        footerText: z.string().optional(),
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

      const errorMessagesToUpdate = db.$with("error_messages_to_update").as(
        db
          .select({ id: errorMessages.id })
          .from(errorMessages)
          .where(
            and(eq(errorMessages.id, id), eq(errorMessages.userId, auth.userId))
          )
      );

      const data = await db
        .with(errorMessagesToUpdate)
        .update(errorMessages)
        .set({
          name: values.name,
          bodyMessage: values.bodyMessage,
          bodyEnding: values.bodyEnding,
          header: values.header,
          headerType: values.headerType,
          headerText: values.headerText,
          footer: values.footer,
          footerText: values.footerText,
        })
        .where(
          inArray(
            errorMessages.id,
            sql`(select id from ${errorMessagesToUpdate})`
          )
        )
        .returning({
          id: errorMessages.id,
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
