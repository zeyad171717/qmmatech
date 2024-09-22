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

import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { eq, and, isNull, asc, max } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono()
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        parentBotId: z.string(),
      })
    ),
    async (c) => {
      const { parentBotId } = c.req.valid("query");

      const data = await db
        .select()
        .from(nodes)
        .where(and(eq(nodes.botId, parentBotId), isNull(nodes.parentId)))
        .orderBy(asc(nodes.index));

      return c.json({ data });
    }
  )
  .get(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),
    async (c) => {
      const { id } = c.req.valid("param");

      const [data] = await db
        .select()
        .from(nodes)
        .innerJoin(messages, eq(nodes.messageId, messages.id))
        .innerJoin(errorMessages, eq(nodes.errorMessageId, errorMessages.id))
        .where(eq(nodes.id, id));

      return c.json({ data });
    }
  )
  .get(
    "/sub-nodes/:parentId",
    zValidator(
      "param",
      z.object({
        parentId: z.string(),
      })
    ),
    async (c) => {
      const { parentId } = c.req.valid("param");

      const data = await db
        .select()
        .from(nodes)
        .where(eq(nodes.parentId, parentId))
        .orderBy(asc(nodes.index));

      return c.json({ data });
    }
  )
  .post(
    "/",
    zValidator(
      "json",
      insertNodeSchema.omit({
        id: true,
        messageId: true,
        errorMessageId: true,
      })
    ),
    async (c) => {
      const values = c.req.valid("json");

      const [errorMessage] = await db
        .insert(errorMessages)
        .values({
          id: createId(),
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

      const [data] = await db
        .update(nodes)
        .set(values)
        .where(eq(nodes.id, id))
        .returning();

      return c.json({ data });
    }
  )
  .patch(
    "/index/:id",
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

      const [node] = await db.select().from(nodes).where(eq(nodes.id, id));

      await db
        .update(nodes)
        .set({ index: state === "up" ? index + 1 : index - 1 })
        .where(and(eq(nodes.parentId, node.parentId), eq(nodes.index, index)));

      const [data] = await db
        .update(nodes)
        .set({
          index,
        })
        .where(eq(nodes.id, id))
        .returning();

      return c.json({ data });
    }
  );

export default app;
