import { db } from "@/db/drizzle";
import { teams } from "@/db/schema";

import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { eq, and, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono()
  .get(
    "/:orgId",
    zValidator("param", z.object({ orgId: z.string() })),
    async (c) => {
      const { orgId } = c.req.valid("param");

      const data = await db
        .select()
        .from(teams)
        .where(and(eq(teams.recordStatus, "created"), eq(teams.orgId, orgId)));

      return c.json({ data });
    }
  )
  .get("/:id", zValidator("param", z.object({ id: z.string() })), async (c) => {
    const { id } = c.req.valid("param");

    const [data] = await db
      .select()
      .from(teams)
      .where(and(eq(teams.id, id), eq(teams.recordStatus, "created")));

    return c.json({ data });
  })
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        orgId: z.string(),
        name: z.string(),
      })
    ),
    async (c) => {
      const values = c.req.valid("json");

      const [data] = await db
        .insert(teams)
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
        .delete(teams)
        .where(inArray(teams.id, values.ids))
        .returning({
          id: teams.id,
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
        orgId: z.string(),
        name: z.string(),
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
        .update(teams)
        .set(values)
        .where(eq(teams.id, id))
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
        .update(teams)
        .set({
          recordStatus: "deleted",
        })
        .where(eq(teams.id, id))
        .returning();

      return c.json({ data });
    }
  );

export default app;
