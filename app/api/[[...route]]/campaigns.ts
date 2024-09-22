import { db } from "@/db/drizzle";
import { campaigns, insertCampaignSchema } from "@/db/schema";

import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { and, desc, eq, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import bcrypt from "bcryptjs";

const app = new Hono()
  .get("/", async (c) => {
    const data = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.recordStatus, "created"))
      .orderBy(desc(campaigns.creationDate));

    return c.json({ data });
  })
  .get("/archived", async (c) => {
    const data = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.recordStatus, "archived"))
      .orderBy(desc(campaigns.creationDate));

    return c.json({ data });
  })
  .get(
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

      const [data] = await db
        .select()
        .from(campaigns)
        .where(eq(campaigns.id, id));

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
        name: z.string(),
        excel: z.string(),
      })
    ),
    async (c) => {
      const { name, excel } = c.req.valid("json");

      const [data] = await db
        .insert(campaigns)
        .values({
          id: createId(),
          name,
          excel: excel,
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
        .update(campaigns)
        .set({ recordStatus: "deleted" })
        .where(inArray(campaigns.id, values.ids))
        .returning({
          id: campaigns.id,
        });

      return c.json({ data });
    }
  )
  .patch(
    "/:id",
    zValidator("param", z.object({ id: z.string().optional() })),
    zValidator("json", insertCampaignSchema.pick({ name: true })),
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

      const [data] = await db
        .update(campaigns)
        .set(values)
        .where(eq(campaigns.id, id))
        .returning();

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

      const [data] = await db
        .update(campaigns)
        .set({ recordStatus: "deleted" })
        .where(eq(campaigns.id, id))
        .returning({
          id: campaigns.id,
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
    "/archive/:id",
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
        .update(campaigns)
        .set({ recordStatus: "archived", status: "Stopped" })
        .where(eq(campaigns.id, id))
        .returning({
          id: campaigns.id,
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

      const [data] = await db
        .update(campaigns)
        .set({ status: "Stopped" })
        .where(eq(campaigns.id, id))
        .returning({
          id: campaigns.id,
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
    "/restore/:id",
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
        .update(campaigns)
        .set({ recordStatus: "created" })
        .where(eq(campaigns.id, id))
        .returning({
          id: campaigns.id,
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
