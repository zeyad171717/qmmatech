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
  linkedMessages,
  templateTypes,
} from "@/db/schema";

const app = new Hono()
  .get(
    "/:nodeId",
    clerkMiddleware(),
    zValidator("param", z.object({ nodeId: z.string() })),
    async (c) => {
      const auth = getAuth(c);
      const { nodeId } = c.req.valid("param");

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
          id: linkedMessages.id,
          name: linkedMessages.name,
          status: linkedMessages.status,
          creationDate: linkedMessages.creationDate,
          activated: linkedMessages.activated,
          position: linkedMessages.position,
        })
        .from(linkedMessages)
        .where(
          and(
            eq(linkedMessages.userId, auth.userId),
            eq(linkedMessages.recordStatus, "created"),
            eq(linkedMessages.nodeId, nodeId)
          )
        )
        .orderBy(desc(linkedMessages.creationDate));

      return c.json({ data });
    }
  )
  .get(
    "/edit/:id",
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
          id: linkedMessages.id,
          name: linkedMessages.name,
          status: linkedMessages.status,
          bodyMessage: linkedMessages.bodyMessage,
          bodyEnding: linkedMessages.bodyEnding,
          header: linkedMessages.header,
          headerType: linkedMessages.headerType,
          headerText: linkedMessages.headerText,
          footer: linkedMessages.footer,
          footerText: linkedMessages.footerText,
          activated: linkedMessages.activated,
          position: linkedMessages.position,
        })
        .from(linkedMessages)
        .where(
          and(eq(linkedMessages.userId, auth.userId), eq(linkedMessages.id, id))
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
  .post(
    "/",
    clerkMiddleware(),
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
        nodeId: z.string(),
        position: z.string(),
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
        .insert(linkedMessages)
        .values({
          id: createId(),
          userId: auth.userId,
          name: values.name,
          bodyMessage: values.bodyMessage,
          bodyEnding: values.bodyEnding,
          header: values.header,
          headerType: values.headerType,
          headerText: values.headerText,
          footer: values.footer,
          footerText: values.footerText,
          status: "Running",
          recordStatus: "created",
          nodeId: values.nodeId,
          position: values.position,
        })
        .returning();

      return c.json({ data });
    }
  )
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()),
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

      const linkedMessagesToDelete = db.$with("linked_messages_to_delete").as(
        db
          .select({ id: linkedMessages.id })
          .from(linkedMessages)
          .where(
            and(
              inArray(linkedMessages.id, values.ids),
              eq(linkedMessages.userId, auth.userId)
            )
          )
      );

      const data = await db
        .with(linkedMessagesToDelete)
        .update(linkedMessages)
        .set({ recordStatus: "deleted" })
        .where(
          inArray(
            linkedMessages.id,
            sql`(select id from ${linkedMessagesToDelete})`
          )
        )
        .returning({
          id: linkedMessages.id,
        });

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
        activated: z.boolean(),
        position: z.string(),
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
          .select({ id: linkedMessages.id })
          .from(linkedMessages)
          .where(
            and(
              eq(linkedMessages.id, id),
              eq(linkedMessages.userId, auth.userId)
            )
          )
      );

      const data = await db
        .with(linkedMessagesToUpdate)
        .update(linkedMessages)
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
          inArray(
            linkedMessages.id,
            sql`(select id from ${linkedMessagesToUpdate})`
          )
        )
        .returning({
          id: linkedMessages.id,
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
  )
  .delete(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string().optional() })),
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

      const linkedMessagesToDelete = db.$with("linked_messages_to_delete").as(
        db
          .select({ id: linkedMessages.id })
          .from(linkedMessages)
          .where(
            and(
              eq(linkedMessages.id, id),
              eq(linkedMessages.userId, auth.userId)
            )
          )
      );

      const data = await db
        .with(linkedMessagesToDelete)
        .update(linkedMessages)
        .set({ recordStatus: "deleted" })
        .where(
          inArray(
            linkedMessages.id,
            sql`(select id from ${linkedMessagesToDelete})`
          )
        )
        .returning({
          id: linkedMessages.id,
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
  )
  .delete(
    "/stop/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string().optional() })),
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

      const linkedMessagesToStop = db.$with("linked_messages_to_stop").as(
        db
          .select({ id: linkedMessages.id })
          .from(linkedMessages)
          .where(
            and(
              eq(linkedMessages.id, id),
              eq(linkedMessages.userId, auth.userId)
            )
          )
      );

      const [data] = await db
        .with(linkedMessagesToStop)
        .update(linkedMessages)
        .set({ status: "Stopped" })
        .where(
          inArray(
            linkedMessages.id,
            sql`(select id from ${linkedMessagesToStop})`
          )
        )
        .returning({
          id: linkedMessages.id,
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
