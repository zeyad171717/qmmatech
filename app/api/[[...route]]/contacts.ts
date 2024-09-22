import { Hono } from "hono";

import { db } from "@/db/drizzle";
import { contacts, insertContactSchema } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";

import { and, eq, inArray } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";

const app = new Hono()
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        filterKey: z.string().optional(),
      })
    ),
    async (c) => {
      const { filterKey } = c.req.valid("query");

      if (!filterKey) {
        const data = await db.select().from(contacts);

        return c.json({ data });
      }

      const data = await db
        .select()
        .from(contacts)
        // @ts-ignore
        .where(
          // @ts-ignore
          eq(contacts[filterKey], true)
        );

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
        .select()
        .from(contacts)
        .where(eq(contacts.id, id));

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
    zValidator("json", insertContactSchema.omit({ id: true })),
    async (c) => {
      const values = c.req.valid("json");

      const [data] = await db
        .insert(contacts)
        .values({ id: createId(), ...values })
        .returning();

      return c.json({ data });
    }
  )
  .post(
    "/bulk-create",
    zValidator("json", z.array(insertContactSchema.omit({ id: true }))),
    async (c) => {
      const values = c.req.valid("json");

      const data = await db
        .insert(contacts)
        .values(
          values.map((value) => ({
            id: createId(),
            ...value,
          }))
        )
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
        .delete(contacts)
        .where(inArray(contacts.id, values.ids))
        .returning({
          id: contacts.id,
        });

      return c.json({ data });
    }
  )
  .patch(
    "/:id",
    zValidator("param", z.object({ id: z.string().optional() })),
    zValidator("json", insertContactSchema.omit({ id: true })),
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
        .update(contacts)
        .set(values)
        .where(eq(contacts.id, id))
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
        .delete(contacts)
        .where(eq(contacts.id, id))
        .returning({
          id: contacts.id,
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
