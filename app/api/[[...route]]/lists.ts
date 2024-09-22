import { db } from "@/db/drizzle";

import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { campaigns, insertListSchema, lists } from "@/db/schema";

const app = new Hono()
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        campaignId: z.string().optional(),
      })
    ),
    async (c) => {
      const { campaignId } = c.req.valid("query");

      const data = await db
        .select({
          id: lists.id,
          name: lists.name,
          status: lists.status,
          creationDate: lists.creationDate,
          campaign: campaigns.name,
          campaignId: lists.campaignId,
        })
        .from(lists)
        .innerJoin(campaigns, eq(lists.campaignId, campaigns.id))
        .where(
          and(
            campaignId ? eq(lists.campaignId, campaignId) : undefined,
            eq(lists.recordStatus, "created")
          )
        )
        .orderBy(desc(lists.creationDate));

      return c.json({ data });
    }
  )
  .get(
    "/archived",
    zValidator(
      "query",
      z.object({
        campaignId: z.string().optional().nullable(),
      })
    ),
    async (c) => {
      const { campaignId } = c.req.valid("query");

      const data = await db
        .select({
          id: lists.id,
          name: lists.name,
          status: lists.status,
          creationDate: lists.creationDate,
          campaign: campaigns.name,
          campaignId: lists.campaignId,
        })
        .from(lists)
        .innerJoin(campaigns, eq(lists.campaignId, campaigns.id))
        .where(
          and(
            campaignId ? eq(lists.campaignId, campaignId) : undefined,
            eq(lists.recordStatus, "archived")
          )
        )
        .orderBy(desc(lists.creationDate));

      return c.json({ data });
    }
  )
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
        .select({
          id: lists.id,
          name: lists.name,
          status: lists.status,
          creationDate: lists.creationDate,
          campaignId: lists.campaignId,
        })
        .from(lists)
        .innerJoin(campaigns, eq(lists.campaignId, campaigns.id))
        .where(eq(lists.id, id));

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
        campaignId: z.string(),
        dailyLimit: z.number().optional(),
        dailySendingLimit: z.number().optional(),
        fromSrl: z.number().optional(),
        toSrl: z.number().optional(),
        ignoreCustomersReceivedMessage: z.number().optional(),
        type: z.enum(["run-now", "schedule"]),
        scheduleDate: z.coerce.date().optional(),
      })
    ),
    async (c) => {
      const values = c.req.valid("json");

      const [data] = await db
        .insert(lists)
        .values({ id: createId(), ...values })
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

      const listsToDelete = db
        .$with("lists_to_delete")
        .as(
          db
            .select({ id: lists.id })
            .from(lists)
            .innerJoin(campaigns, eq(lists.campaignId, campaigns.id))
            .where(inArray(lists.id, values.ids))
        );

      const data = await db
        .with(listsToDelete)
        .update(lists)
        .set({ recordStatus: "deleted" })
        .where(inArray(lists.id, sql`(select id from ${listsToDelete})`))
        .returning({
          id: lists.id,
        });

      return c.json({ data });
    }
  )
  .patch(
    "/:id",
    zValidator("param", z.object({ id: z.string().optional() })),
    zValidator("json", insertListSchema.pick({ name: true })),
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

      const listsToUpdate = db.$with("lists_to_update").as(
        db
          .select({ id: lists.id })
          .from(lists)
          .innerJoin(campaigns, eq(lists.campaignId, campaigns.id))
          .where(and(eq(lists.id, id)))
      );

      const [data] = await db
        .with(listsToUpdate)
        .update(lists)
        .set(values)
        .where(inArray(lists.id, sql`(select id from ${listsToUpdate})`))
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

      const listsToDelete = db.$with("lists_to_delete").as(
        db
          .select({ id: lists.id })
          .from(lists)
          .innerJoin(campaigns, eq(lists.campaignId, campaigns.id))
          .where(and(eq(lists.id, id)))
      );

      const [data] = await db
        .with(listsToDelete)
        .update(lists)
        .set({ recordStatus: "deleted" })
        .where(inArray(lists.id, sql`(select id from ${listsToDelete})`))
        .returning({
          id: lists.id,
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

      const listsToArchive = db.$with("lists_to_archive").as(
        db
          .select({ id: lists.id })
          .from(lists)
          .innerJoin(campaigns, eq(lists.campaignId, campaigns.id))
          .where(and(eq(lists.id, id)))
      );

      const [data] = await db
        .with(listsToArchive)
        .update(lists)
        .set({ recordStatus: "archived", status: "Stopped" })
        .where(inArray(lists.id, sql`(select id from ${listsToArchive})`))
        .returning({
          id: lists.id,
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

      const listsToStop = db.$with("lists_to_stop").as(
        db
          .select({ id: lists.id })
          .from(lists)
          .innerJoin(campaigns, eq(lists.campaignId, campaigns.id))
          .where(and(eq(lists.id, id)))
      );

      const [data] = await db
        .with(listsToStop)
        .update(lists)
        .set({ status: "Stopped" })
        .where(inArray(lists.id, sql`(select id from ${listsToStop})`))
        .returning({
          id: lists.id,
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

      const listsToRestore = db.$with("lists_to_restore").as(
        db
          .select({ id: lists.id })
          .from(lists)
          .innerJoin(campaigns, eq(lists.campaignId, campaigns.id))
          .where(and(eq(lists.id, id)))
      );

      const [data] = await db
        .with(listsToRestore)
        .update(lists)
        .set({ recordStatus: "created" })
        .where(inArray(lists.id, sql`(select id from ${listsToRestore})`))
        .returning({
          id: lists.id,
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
