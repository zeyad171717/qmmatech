import { db } from "@/db/drizzle";
import { permissions, roles, rolesToPermissions } from "@/db/schema";

import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { eq, and, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono()
  .get("/", async (c) => {
    const rolesWithPermissions = await db
      .select({
        roleId: roles.id,
        roleName: roles.name,
        roleDescription: roles.description,
        permissionId: permissions.id,
        permissionName: permissions.name,
      })
      .from(roles)
      .leftJoin(rolesToPermissions, eq(roles.id, rolesToPermissions.roleId))
      .leftJoin(
        permissions,
        eq(rolesToPermissions.permissionId, permissions.id)
      );

    const data = rolesWithPermissions.reduce((acc, row) => {
      let role = acc.find((r) => r.id === row.roleId);

      if (!role) {
        role = {
          id: row.roleId,
          name: row.roleName,
          description: row.roleDescription,
          permissions: [],
        };
        acc.push(role);
      }

      if (row.permissionId) {
        role.permissions.push({
          id: row.permissionId,
          name: row.permissionName,
        });
      }

      return acc;
    }, []);

    return c.json({ data });
  })
  .get("/:id", zValidator("param", z.object({ id: z.string() })), async (c) => {
    const { id } = c.req.valid("param");

    const roleWithPermissions = await db
      .select({
        roleId: roles.id,
        roleName: roles.name,
        roleDescription: roles.description,
        permissionId: permissions.id,
        permissionName: permissions.name,
      })
      .from(roles)
      .leftJoin(rolesToPermissions, eq(roles.id, rolesToPermissions.roleId))
      .leftJoin(
        permissions,
        eq(rolesToPermissions.permissionId, permissions.id)
      )
      .where(eq(roles.id, id));

    const data = {
      id: roleWithPermissions[0]?.roleId || null,
      name: roleWithPermissions[0]?.roleName || null,
      description: roleWithPermissions[0]?.roleDescription || null,
      permissions: roleWithPermissions
        .map((row) => ({
          id: row.permissionId,
          name: row.permissionName,
        }))
        .filter((permission) => permission.id !== null),
    };

    return c.json({ data });
  })
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        orgId: z.string(),
        name: z.string(),
        description: z.string(),
        permissions: z.array(z.string()),
      })
    ),
    async (c) => {
      const values = c.req.valid("json");

      const data = await db
        .insert(roles)
        .values({
          id: createId(),
          name: values.name,
          description: values.description,
        })
        .returning({ id: roles.id });

      const roleId = data[0].id;

      if (values.permissions && values.permissions.length > 0) {
        const rolePermissionEntries = values.permissions.map(
          (permissionId) => ({
            roleId,
            permissionId,
            orgId: values.orgId,
          })
        );

        await db.insert(rolesToPermissions).values(rolePermissionEntries);
      }

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
        .update(rolesToPermissions)
        .set({ recordStatus: "deleted" })
        .where(inArray(rolesToPermissions.roleId, values.ids));

      await db
        .update(roles)
        .set({ recordStatus: "deleted" })
        .where(inArray(roles.id, values.ids));

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
        description: z.string(),
        permissions: z.array(z.string()),
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

      const data = await db
        .update(roles)
        .set({ name: values.name, description: values.description })
        .where(eq(roles.id, id));

      await db
        .delete(rolesToPermissions)
        .where(eq(rolesToPermissions.roleId, id));

      if (values.permissions && values.permissions.length > 0) {
        const newRolePermissionEntries = values.permissions.map(
          (permissionId) => ({
            roleId: id,
            permissionId,
            orgId: values.orgId,
          })
        );

        await db.insert(rolesToPermissions).values(newRolePermissionEntries);
      }

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

      const data = await db
        .update(rolesToPermissions)
        .set({ recordStatus: "deleted" })
        .where(eq(rolesToPermissions.roleId, id));

      await db
        .update(roles)
        .set({ recordStatus: "deleted" })
        .where(eq(roles.id, id));

      return c.json({ data });
    }
  );

export default app;
