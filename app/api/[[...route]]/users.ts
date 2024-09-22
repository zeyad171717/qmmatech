import { db } from "@/db/drizzle";
import { channels, users, usersToChannels } from "@/db/schema";

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

      const usersWithChannels = await db
        .select({
          userId: users.id,
          username: users.username,
          channelId: channels.id,
          channelName: channels.name,
        })
        .from(users)
        .leftJoin(usersToChannels, eq(users.id, usersToChannels.userId))
        .leftJoin(channels, eq(usersToChannels.channelId, channels.id))
        .where(and(eq(users.orgId, orgId), eq(users.recordStatus, "created")));

      const data = usersWithChannels.reduce((acc, row) => {
        let user = acc.find((u) => u.id === row.userId);

        if (!user) {
          user = {
            id: row.userId,
            name: row.username,
            channels: [],
          };
          acc.push(user);
        }

        if (row.channelId) {
          user.channels.push({
            id: row.channelId,
            name: row.channelName,
          });
        }

        return acc;
      }, []);

      return c.json({ data });
    }
  )
  .get("/:id", zValidator("param", z.object({ id: z.string() })), async (c) => {
    const { id } = c.req.valid("param");

    const userWithChannels = await db
      .select({
        userId: users.id,
        orgId: users.orgId,
        roleId: users.roleId,
        username: users.username,
        imgUrl: users.imgUrl,
        status: users.status,
        language: users.language,
        email: users.email,
        password: users.password,
        phoneNumber: users.phoneNumber,
        channelId: channels.id,
      })
      .from(users)
      .leftJoin(usersToChannels, eq(users.id, usersToChannels.userId))
      .leftJoin(channels, eq(usersToChannels.channelId, channels.id))
      .where(and(eq(users.id, id), eq(users.recordStatus, "created")));

    const data = {
      id: userWithChannels[0]?.userId || null,
      username: userWithChannels[0]?.username || null,
      orgId: userWithChannels[0]?.orgId || null,
      roleId: userWithChannels[0]?.roleId || null,
      imgUrl: userWithChannels[0]?.imgUrl || null,
      status: userWithChannels[0]?.status || null,
      language: userWithChannels[0]?.language || null,
      email: userWithChannels[0]?.email || null,
      password: userWithChannels[0]?.password || null,
      phoneNumber: userWithChannels[0]?.phoneNumber || null,
      channels: userWithChannels
        .map((row) => ({
          id: row.channelId,
        }))
        .filter((channel) => channel.id !== null),
    };

    return c.json({ data });
  })
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        orgId: z.string(),
        roleId: z.string(),
        username: z.string(),
        imgUrl: z.string(),
        status: z.string(),
        language: z.string(),
        email: z.string(),
        password: z.string(),
        phoneNumber: z.string(),
      })
    ),
    async (c) => {
      const values = c.req.valid("json");

      const [data] = await db
        .insert(users)
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
        .update(usersToChannels)
        .set({ recordStatus: "deleted" })
        .where(inArray(usersToChannels.userId, values.ids));

      await db
        .update(users)
        .set({ recordStatus: "deleted" })
        .where(inArray(users.id, values.ids));

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
        roleId: z.string(),
        username: z.string(),
        imgUrl: z.string(),
        status: z.string(),
        language: z.string(),
        email: z.string(),
        password: z.string(),
        phoneNumber: z.string(),
        channels: z.array(z.string()),
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
        .update(users)
        .set({
          orgId: values.orgId,
          roleId: values.roleId,
          username: values.username,
          imgUrl: values.imgUrl,
          status: values.status,
          language: values.language,
          email: values.email,
          password: values.password,
          phoneNumber: values.phoneNumber,
        })
        .where(eq(users.id, id));

      await db.delete(usersToChannels).where(eq(usersToChannels.userId, id));

      if (values.channels && values.channels.length > 0) {
        const newUserChannelEntries = values.channels.map((channelId) => ({
          userId: id,
          channelId,
          orgId: values.orgId,
        }));

        await db.insert(usersToChannels).values(newUserChannelEntries);
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
        .update(usersToChannels)
        .set({ recordStatus: "deleted" })
        .where(eq(usersToChannels.userId, id));

      await db
        .update(users)
        .set({ recordStatus: "deleted" })
        .where(eq(users.id, id));

      return c.json({ data });
    }
  );

export default app;
