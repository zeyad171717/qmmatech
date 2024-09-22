import { db } from "@/db/drizzle";
import {
  bots,
  errorMessages,
  insertBotSchema,
  messages,
  nodes,
} from "@/db/schema";

import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { eq, and } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono()
  .get("/", async (c) => {
    const data = await db.select().from(bots);

    return c.json({ data });
  })
  .post(
    "/",
    zValidator(
      "json",
      insertBotSchema.omit({
        id: true,
        messageId: true,
        errorMessageId: true,
      })
    ),
    async (c) => {
      const values = c.req.valid("json");

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

      const [data] = await db
        .insert(bots)
        .values({
          id: createId(),
          messageId: message.id,
          errorMessageId: errorMessage.id,
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
        id: z.string().optional(),
      })
    ),
    zValidator("json", insertBotSchema.omit({ id: true, messageId: true })),
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
        .update(bots)
        .set(values)
        .where(eq(bots.id, id))
        .returning();

      return c.json({ data });
    }
  );

export default app;
