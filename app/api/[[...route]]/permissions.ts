import { db } from "@/db/drizzle";
import { permissions } from "@/db/schema";

import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { eq, and, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono()
  .get("/", async (c) => {
    const data = await db
      .select()
      .from(permissions)
      .where(eq(permissions.recordStatus, "created"));

    return c.json({ data });
  })
  .get("/:id", zValidator("param", z.object({ id: z.string() })), async (c) => {
    const { id } = c.req.valid("param");

    const [data] = await db
      .select()
      .from(permissions)
      .where(
        and(eq(permissions.id, id), eq(permissions.recordStatus, "created"))
      );

    return c.json({ data });
  })
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        name: z.string(),
        description: z.string(),
      })
    ),
    async (c) => {
      const values = c.req.valid("json");

      const [data] = await db
        .insert(permissions)
        .values({
          id: createId(),
          name: values.name,
          description: values.description,
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
        .delete(permissions)
        .where(inArray(permissions.id, values.ids))
        .returning({
          id: permissions.id,
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
        description: z.string(),
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
        .update(permissions)
        .set(values)
        .where(eq(permissions.id, id))
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
        .update(permissions)
        .set({
          recordStatus: "deleted",
        })
        .where(eq(permissions.id, id))
        .returning();

      return c.json({ data });
    }
  );

export default app;
