import { db } from "@/db/drizzle";
import {
  bots,
  errorMessages,
  insertBotSchema,
  insertNodeSchema,
  messages,
  nodes,
  templateHeaders,
} from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { eq, and, isNull, asc, max } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono()
  .get(
    "/",
    clerkMiddleware(),
    zValidator(
      "query",
      z.object({
        parentBotId: z.string(),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const { parentBotId } = c.req.valid("query");

      if (!auth?.userId) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      const data = await db
        .select()
        .from(nodes)
        .where(
          and(
            eq(nodes.userId, auth.userId),
            eq(nodes.botId, parentBotId),
            isNull(nodes.parentId)
          )
        )
        .orderBy(asc(nodes.index));

      return c.json({ data });
    }
  )
  .get(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!auth?.userId) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      const [data] = await db
        .select()
        .from(nodes)
        .innerJoin(messages, eq(nodes.messageId, messages.id))
        .innerJoin(errorMessages, eq(nodes.errorMessageId, errorMessages.id))
        .where(and(eq(nodes.userId, auth.userId), eq(nodes.id, id)));

      return c.json({ data });
    }
  )
  .get(
    "/sub-nodes/:parentId",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        parentId: z.string(),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const { parentId } = c.req.valid("param");

      if (!auth?.userId) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      const data = await db
        .select()
        .from(nodes)
        .where(and(eq(nodes.userId, auth.userId), eq(nodes.parentId, parentId)))
        .orderBy(asc(nodes.index));

      return c.json({ data });
    }
  )
  .post(
    "/",
    clerkMiddleware(),
    zValidator(
      "json",
      insertNodeSchema.omit({
        userId: true,
        id: true,
        messageId: true,
        errorMessageId: true,
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

      const [errorMessage] = await db
        .insert(errorMessages)
        .values({
          id: createId(),
          userId: auth.userId,
          bodyMessage: "",
          name: "",
          footer: true,
          header: true,
        })
        .returning();

      const [message] = await db
        .insert(messages)
        .values({
          id: createId(),
          userId: auth.userId,
          bodyMessage: "",
          name: "",
          footer: true,
          header: true,
        })
        .returning();

      const [node] = await db
        .select({ index: max(nodes.index) })
        .from(nodes)
        .where(
          and(
            eq(nodes.userId, auth.userId),
            eq(nodes.botId, values.botId),
            values.parentId
              ? eq(nodes.parentId, values.parentId)
              : isNull(nodes.parentId)
          )
        );

      const [data] = await db
        .insert(nodes)
        .values({
          id: createId(),
          userId: auth.userId,
          messageId: message.id,
          errorMessageId: errorMessage.id,
          // @ts-ignore
          index: node.index + 1,
          ...values,
        })
        .returning();

      return c.json({ data });
    }
  )
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),
    zValidator(
      "json",
      z.object({
        name: z.string().optional(),
        index: z.number().optional(),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");
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
        .update(nodes)
        .set(values)
        .where(and(eq(nodes.userId, auth.userId), eq(nodes.id, id)))
        .returning();

      return c.json({ data });
    }
  )
  .patch(
    "/index/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),
    zValidator(
      "json",
      z.object({
        index: z.number(),
        state: z.enum(["up", "down"]),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const { index, state } = c.req.valid("json");
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

      const [node] = await db
        .select()
        .from(nodes)
        .where(and(eq(nodes.userId, auth.userId), eq(nodes.id, id)));

      await db
        .update(nodes)
        .set({ index: state === "up" ? index + 1 : index - 1 })
        .where(
          and(
            eq(nodes.userId, auth.userId),
            eq(nodes.parentId, node.parentId),
            eq(nodes.index, index)
          )
        );

      const [data] = await db
        .update(nodes)
        .set({
          index,
        })
        .where(and(eq(nodes.userId, auth.userId), eq(nodes.id, id)))
        .returning();

      return c.json({ data });
    }
  );

export default app;
