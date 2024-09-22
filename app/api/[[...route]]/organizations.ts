import { db } from "@/db/drizzle";
import { organizations } from "@/db/schema";

import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { eq, and, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono()
  .get("/", async (c) => {
    const data = await db
      .select()
      .from(organizations)
      .where(eq(organizations.recordStatus, "created"));

    return c.json({ data });
  })
  .get("/:id", zValidator("param", z.object({ id: z.string() })), async (c) => {
    const { id } = c.req.valid("param");

    const [data] = await db
      .select()
      .from(organizations)
      .where(
        and(eq(organizations.id, id), eq(organizations.recordStatus, "created"))
      );

    return c.json({ data });
  })
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        name: z.string(),
        country: z.string(),
        city: z.string(),
        phone: z.string(),
      })
    ),
    async (c) => {
      const values = c.req.valid("json");

      const [data] = await db
        .insert(organizations)
        .values({
          id: createId(),
          ...values,
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

      const data = await db
        .delete(organizations)
        .where(inArray(organizations.id, values.ids))
        .returning({
          id: organizations.id,
        });

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
    zValidator(
      "json",
      z.object({
        name: z.string(),
        country: z.string(),
        city: z.string(),
        phone: z.string(),
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
        .update(organizations)
        .set(values)
        .where(eq(organizations.id, id))
        .returning();

      return c.json({ data });
    }
  )
  .delete(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
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
        .update(organizations)
        .set({
          recordStatus: "deleted",
        })
        .where(eq(organizations.id, id))
        .returning();

      return c.json({ data });
    }
  );

export default app;
