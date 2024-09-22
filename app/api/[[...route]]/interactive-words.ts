import { db } from "@/db/drizzle";

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
  interactiveWords,
  templateTypes,
  messages,
} from "@/db/schema";

const app = new Hono()
  .get(
    "/:nodeId",
    zValidator("param", z.object({ nodeId: z.string() })),
    async (c) => {
      const { nodeId } = c.req.valid("param");

      const data = await db
        .select({
          id: interactiveWords.id,
          word: interactiveWords.word,
          filter: interactiveWords.filter,
          message: messages.name,
          status: interactiveWords.status,
          creationDate: interactiveWords.creationDate,
        })
        .from(interactiveWords)
        .innerJoin(messages, eq(messages.id, interactiveWords.messageId))
        .where(
          and(
            eq(interactiveWords.recordStatus, "created"),
            eq(interactiveWords.nodeId, nodeId)
          )
        )
        .orderBy(desc(interactiveWords.creationDate));

      return c.json({ data });
    }
  )
  .get(
    "/edit/:id",
    zValidator("param", z.object({ id: z.string().optional() })),
    async (c) => {
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
        .select({
          id: interactiveWords.id,
          word: interactiveWords.word,
          filter: interactiveWords.filter,
          messageId: interactiveWords.messageId,
        })
        .from(interactiveWords)
        .where(eq(interactiveWords.id, id));

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
    zValidator(
      "json",
      z.object({
        word: z.string(),
        filter: z.string(),
        messageId: z.string(),
        nodeId: z.string(),
      })
    ),
    async (c) => {
      const values = c.req.valid("json");

      const [data] = await db
        .insert(interactiveWords)
        .values({
          id: createId(),
          word: values.word,
          filter: values.filter,
          messageId: values.messageId,
          status: "Running",
          recordStatus: "created",
          nodeId: values.nodeId,
        })
        .returning();

      return c.json({ data });
    }
  )
  .post(
    "/bulk-delete",
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()),
      })
    ),
    async (c) => {
      const values = c.req.valid("json");

      const interactiveWordsToDelete = db
        .$with("interactive_words_to_delete")
        .as(
          db
            .select({ id: interactiveWords.id })
            .from(interactiveWords)
            .where(and(inArray(interactiveWords.id, values.ids)))
        );

      const data = await db
        .with(interactiveWordsToDelete)
        .update(interactiveWords)
        .set({ recordStatus: "deleted" })
        .where(
          inArray(
            interactiveWords.id,
            sql`(select id from ${interactiveWordsToDelete})`
          )
        )
        .returning({
          id: interactiveWords.id,
        });

      return c.json({ data });
    }
  )
  .patch(
    "/:id",
    zValidator("param", z.object({ id: z.string().optional() })),
    zValidator(
      "json",
      z.object({
        word: z.string().optional(),
        filter: z.string().optional(),
        messageId: z.string().optional(),
      })
    ),
    async (c) => {
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

      const interactiveWordsToUpdate = db
        .$with("interactive_words_to_update")
        .as(
          db
            .select({ id: interactiveWords.id })
            .from(interactiveWords)
            .where(and(eq(interactiveWords.id, id)))
        );

      const data = await db
        .with(interactiveWordsToUpdate)
        .update(interactiveWords)
        .set({
          word: values.word,
          filter: values.filter,
          messageId: values.messageId,
        })
        .where(
          inArray(
            interactiveWords.id,
            sql`(select id from ${interactiveWordsToUpdate})`
          )
        )
        .returning({
          id: interactiveWords.id,
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
    zValidator("param", z.object({ id: z.string().optional() })),
    async (c) => {
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json(
          {
            error: "Missing id",
          },
          400
        );
      }

      const interactiveWordsToDelete = db
        .$with("interactive_words_to_delete")
        .as(
          db
            .select({ id: interactiveWords.id })
            .from(interactiveWords)
            .where(and(eq(interactiveWords.id, id)))
        );

      const data = await db
        .with(interactiveWordsToDelete)
        .update(interactiveWords)
        .set({ recordStatus: "deleted" })
        .where(
          inArray(
            interactiveWords.id,
            sql`(select id from ${interactiveWordsToDelete})`
          )
        )
        .returning({
          id: interactiveWords.id,
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
    zValidator("param", z.object({ id: z.string().optional() })),
    async (c) => {
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json(
          {
            error: "Missing id",
          },
          400
        );
      }

      const interactiveWordsToStop = db.$with("interactive_words_to_stop").as(
        db
          .select({ id: interactiveWords.id })
          .from(interactiveWords)
          .where(and(eq(interactiveWords.id, id)))
      );

      const [data] = await db
        .with(interactiveWordsToStop)
        .update(interactiveWords)
        .set({ status: "Stopped" })
        .where(
          inArray(
            interactiveWords.id,
            sql`(select id from ${interactiveWordsToStop})`
          )
        )
        .returning({
          id: interactiveWords.id,
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
