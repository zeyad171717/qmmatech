import { db } from "@/db/drizzle";

import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import bcrypt from "bcryptjs";
import {
  templateButtonTypes,
  templateCategories,
  templateFooters,
  templateHeaders,
  templateHeaderTypes,
  templateLanguages,
  templates,
  templateTypes,
} from "@/db/schema";

const app = new Hono()
  .get("/", async (c) => {
    const data = await db
      .select({
        id: templates.id,
        name: templates.name,
        allowCategoryChange: templates.allowCategoryChange,
        categoryId: templates.categoryId,
        category: templateCategories.name,
        typeId: templates.typeId,
        type: templateTypes.name,
        languageId: templates.languageId,
        language: templateLanguages.name,
        status: templates.status,
        creationDate: templates.creationDate,
      })
      .from(templates)
      .innerJoin(
        templateCategories,
        eq(templates.categoryId, templateCategories.id)
      )
      .innerJoin(templateTypes, eq(templates.typeId, templateTypes.id))
      .innerJoin(
        templateLanguages,
        eq(templates.languageId, templateLanguages.id)
      )
      .where(eq(templates.recordStatus, "created"))
      .orderBy(desc(templates.creationDate));

    return c.json({ data });
  })
  .get("/categories", async (c) => {
    const data = await db
      .select({
        label: templateCategories.name,
        value: templateCategories.id,
      })
      .from(templateCategories);

    return c.json({ data });
  })
  .get("/types", async (c) => {
    const data = await db
      .select({
        label: templateTypes.name,
        value: templateTypes.id,
      })
      .from(templateTypes);

    return c.json({ data });
  })
  .get("/languages", async (c) => {
    const data = await db
      .select({
        label: templateLanguages.name,
        value: templateLanguages.id,
      })
      .from(templateLanguages);

    return c.json({ data });
  })
  .get("/header-types", async (c) => {
    const data = await db
      .select({
        label: templateHeaderTypes.name,
        value: templateHeaderTypes.id,
      })
      .from(templateHeaderTypes);

    return c.json({ data });
  })
  .get("/button-types", async (c) => {
    const data = await db
      .select({
        label: templateButtonTypes.name,
        value: templateButtonTypes.id,
      })
      .from(templateButtonTypes)
      .orderBy(asc(templateButtonTypes.id));

    return c.json({ data });
  })
  .get("/archived", async (c) => {
    const data = await db
      .select({
        id: templates.id,
        name: templates.name,
        allowCategoryChange: templates.allowCategoryChange,
        categoryId: templates.categoryId,
        category: templateCategories.name,
        typeId: templates.typeId,
        type: templateTypes.name,
        languageId: templates.languageId,
        language: templateLanguages.name,
        status: templates.status,
        creationDate: templates.creationDate,
      })
      .from(templates)
      .innerJoin(
        templateCategories,
        eq(templates.categoryId, templateCategories.id)
      )
      .innerJoin(templateTypes, eq(templates.typeId, templateTypes.id))
      .innerJoin(
        templateLanguages,
        eq(templates.languageId, templateLanguages.id)
      )
      .where(eq(templates.recordStatus, "archived"))
      .orderBy(desc(templates.creationDate));

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
        .select({
          id: templates.id,
          name: templates.name,
          allowCategoryChange: templates.allowCategoryChange,
          categoryId: templates.categoryId,
          typeId: templates.typeId,
          languageId: templates.languageId,
          status: templates.status,
          headerId: templates.headerId,
          bodyMessage: templates.bodyMessage,
          footerId: templates.footerId,
        })
        .from(templates)
        .innerJoin(
          templateCategories,
          eq(templates.categoryId, templateCategories.id)
        )
        .innerJoin(templateTypes, eq(templates.typeId, templateTypes.id))
        .innerJoin(
          templateLanguages,
          eq(templates.languageId, templateLanguages.id)
        )
        .where(eq(templates.id, id));

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
        allowCategoryChange: z.boolean(),
        categoryId: z.string(),
        typeId: z.string(),
        languageId: z.string(),
        bodyMessage: z.string(),
        header: z.boolean(),
        headerTypeId: z.string().optional(),
        headerText: z.string().optional(),
        footer: z.boolean(),
        footerText: z.string().optional(),
      })
    ),
    async (c) => {
      const values = c.req.valid("json");

      let headerId: any;
      let footerId: any;

      if (values.header === true) {
        await db
          .insert(templateHeaders)
          // @ts-ignore
          .values({
            id: createId(),
            typeId: values.headerTypeId,
            text: values.headerText,
          })
          .returning()
          .then((res) => {
            headerId = res[0].id;
          });
      } else {
        headerId = null;
      }
      if (values.footer === true) {
        footerId = await db
          .insert(templateFooters)
          // @ts-ignore
          .values({
            id: createId(),
            text: values.footerText,
          })
          .returning()
          .then((res) => {
            footerId = res[0].id;
          });
      } else {
        footerId = null;
      }

      const [data] = await db
        .insert(templates)
        .values({
          id: createId(),
          name: values.name,
          allowCategoryChange: values.allowCategoryChange,
          bodyMessage: values.bodyMessage,
          categoryId: values.categoryId,
          typeId: values.typeId,
          languageId: values.languageId,
          headerId,
          footerId,
          status: "Running",
          recordStatus: "created",
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

      const templatesToDelete = db.$with("templates_to_delete").as(
        db
          .select({ id: templates.id })
          .from(templates)
          .where(and(inArray(templates.id, values.ids)))
      );

      const data = await db
        .with(templatesToDelete)
        .update(templates)
        .set({ recordStatus: "deleted" })
        .where(
          inArray(templates.id, sql`(select id from ${templatesToDelete})`)
        )
        .returning({
          id: templates.id,
        });

      return c.json({ data });
    }
  )
  .patch(
    "/:id",
    zValidator("param", z.object({ id: z.string().optional() })),
    zValidator(
      "json",
      z.object({
        name: z.string(),
        allowCategoryChange: z.boolean(),
        categoryId: z.string(),
        typeId: z.string(),
        languageId: z.string(),
        bodyMessage: z.string(),
        header: z.boolean(),
        headerTypeId: z.string().optional(),
        headerText: z.string().optional(),
        footer: z.boolean(),
        footerText: z.string().optional(),
      })
    ),
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

      let headerId: any;
      let footerId: any;

      if (values.header === true) {
        await db
          .update(templateHeaders)
          .set({
            typeId: values.headerTypeId,
            text: values.headerText,
          })
          .returning()
          .then((res) => {
            headerId = res[0].id;
          });
      } else {
        headerId = null;
      }
      if (values.footer === true) {
        footerId = await db
          .update(templateFooters)
          .set({
            text: values.footerText,
          })
          .returning()
          .then((res) => {
            footerId = res[0].id;
          });
      } else {
        footerId = null;
      }

      const templatesToUpdate = db.$with("templates_to_update").as(
        db
          .select({ id: templates.id })
          .from(templates)
          .where(and(eq(templates.id, id)))
      );

      const data = await db
        .with(templatesToUpdate)
        .update(templates)
        .set({
          allowCategoryChange: values.allowCategoryChange,
          name: values.name,
          categoryId: values.categoryId,
          languageId: values.languageId,
          typeId: values.typeId,
          bodyMessage: values.bodyMessage,
          headerId,
          footerId,
        })
        .where(
          inArray(templates.id, sql`(select id from ${templatesToUpdate})`)
        )
        .returning({
          id: templates.id,
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

      const templatesToDelete = db.$with("templates_to_delete").as(
        db
          .select({ id: templates.id })
          .from(templates)
          .where(and(eq(templates.id, id)))
      );

      const data = await db
        .with(templatesToDelete)
        .update(templates)
        .set({ recordStatus: "deleted" })
        .where(
          inArray(templates.id, sql`(select id from ${templatesToDelete})`)
        )
        .returning({
          id: templates.id,
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

      const templatesToArchive = db.$with("templates_to_archive").as(
        db
          .select({ id: templates.id })
          .from(templates)
          .where(and(eq(templates.id, id)))
      );

      const [data] = await db
        .with(templatesToArchive)
        .update(templates)
        .set({ recordStatus: "archived", status: "Stopped" })
        .where(
          inArray(templates.id, sql`(select id from ${templatesToArchive})`)
        )
        .returning({
          id: templates.id,
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

      const templatesToStop = db.$with("templates_to_stop").as(
        db
          .select({ id: templates.id })
          .from(templates)
          .innerJoin(
            templateCategories,
            eq(templates.categoryId, templateCategories.id)
          )
          .innerJoin(templateTypes, eq(templates.typeId, templateTypes.id))
          .innerJoin(
            templateLanguages,
            eq(templates.languageId, templateLanguages.id)
          )
          .where(and(eq(templates.id, id)))
      );

      const [data] = await db
        .with(templatesToStop)
        .update(templates)
        .set({ status: "Stopped" })
        .where(inArray(templates.id, sql`(select id from ${templatesToStop})`))
        .returning({
          id: templates.id,
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

      const templatesToRestore = db.$with("templates_to_restore").as(
        db
          .select({ id: templates.id })
          .from(templates)
          .where(and(eq(templates.id, id)))
      );

      const [data] = await db
        .with(templatesToRestore)
        .update(templates)
        .set({ recordStatus: "created" })
        .where(
          inArray(templates.id, sql`(select id from ${templatesToRestore})`)
        )
        .returning({
          id: templates.id,
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
