import { db } from "@/db/drizzle";
import { bots, insertBotSchema, insertNodeSchema, nodes } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { eq, and } from "drizzle-orm";
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
          and(eq(nodes.userId, auth.userId), eq(nodes.botId, parentBotId))
        );

      return c.json({ data });
    }
  )
  .post(
    "/",
    clerkMiddleware(),
    zValidator("json", insertNodeSchema.omit({ userId: true, id: true })),
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
        .insert(nodes)
        .values({ id: createId(), userId: auth.userId, ...values })
        .returning();

      return c.json({ data });
    }
  );

export default app;
