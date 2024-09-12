import { db } from "@/db/drizzle";
import { bots, errorMessages, insertBotSchema, messages, nodes } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { eq, and } from "drizzle-orm";
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
      .select()
      .from(bots)
      .where(eq(bots.userId, auth.userId));

    return c.json({ data });
  })
  .post(
    "/",
    clerkMiddleware(),
    zValidator(
      "json",
      insertBotSchema.omit({
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

      const [data] = await db
        .insert(bots)
        .values({
          id: createId(),
          userId: auth.userId,
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
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    zValidator(
      "json",
      insertBotSchema.omit({ id: true, userId: true, messageId: true })
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
        .update(bots)
        .set(values)
        .where(and(eq(bots.userId, auth.userId), eq(bots.id, id)))
        .returning();

      return c.json({ data });
    }
  );

export default app;
