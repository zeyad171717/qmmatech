import { db } from "@/db/drizzle";
import { bots, insertBotSchema } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono()
  .get(
    "/",
    clerkMiddleware(),
    zValidator(
      "query",
      z.object({
        parentBotId: z.string().optional(),
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

      if (parentBotId) {
        const data = await db
          .select()
          .from(bots)
          .where(
            and(eq(bots.userId, auth.userId), eq(bots.parentBotId, parentBotId))
          );

        return c.json({ data });
      }

      const data = await db
        .select()
        .from(bots)
        .where(eq(bots.userId, auth.userId));

      return c.json({ data });
    }
  )
  .post(
    "/",
    clerkMiddleware(),
    zValidator("json", insertBotSchema.omit({ userId: true, id: true })),
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
        .insert(bots)
        .values({ id: createId(), userId: auth.userId, ...values })
        .returning();

      return c.json({ data });
    }
  );

export default app;
