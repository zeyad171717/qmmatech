import { db } from "@/db/drizzle";
import { channels, users, usersToChannels } from "@/db/schema";

import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { channel } from "diagnostics_channel";
import { eq, and, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono()
  .get(
    "/:orgId",
    zValidator("param", z.object({ orgId: z.string() })),
    async (c) => {
      const { orgId } = c.req.valid("param");

      const channelsWithUsers = await db
        .select({
          channelId: usersToChannels.channelId,
          channelName: channels.name,
          userId: usersToChannels.userId,
          userName: users.username,
        })
        .from(usersToChannels)
        .leftJoin(channels, eq(usersToChannels.channelId, channels.id))
        .leftJoin(users, eq(usersToChannels.userId, users.id))
        .where(
          and(
            eq(usersToChannels.recordStatus, "created"),
            eq(usersToChannels.orgId, orgId)
          )
        );

      const data = channelsWithUsers.reduce((acc, row) => {
        let channel = acc.find((ch) => ch.id === row.channelId);

        if (!channel) {
          channel = {
            id: row.channelId,
            name: row.channelName,
            users: [],
          };
          acc.push(channel);
        }

        if (row.userId) {
          channel.users.push({
            id: row.userId,
            username: row.username,
          });
        }

        return acc;
      }, []);

      return c.json({ data });
    }
  )
  .get("/:id", zValidator("param", z.object({ id: z.string() })), async (c) => {
    const { id } = c.req.valid("param");

    const channelWithUsers = await db
      .select({
        channelId: usersToChannels.channelId,
        channelName: channels.name,
        userId: usersToChannels.userId,
        userName: users.username,
      })
      .from(usersToChannels)
      .leftJoin(channels, eq(usersToChannels.channelId, channels.id))
      .leftJoin(users, eq(usersToChannels.userId, users.id))
      .where(
        and(
          eq(usersToChannels.channelId, id),
          eq(usersToChannels.recordStatus, "created")
        )
      );

    let channelData = {
      id: channelWithUsers[0]?.channelId || null,
      name: channelWithUsers[0]?.channelName || null,
      users: [],
    };

    channelWithUsers.forEach((row) => {
      if (row.userName) {
        channelData.users.push({ id: row.userId, name: row.userName });
      }
    });

    const data = channelData[0];

    return c.json({ data });
  })
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        name: z.string(),
        orgId: z.string(),
        users: z.array(z.string()),
      })
    ),
    async (c) => {
      const values = c.req.valid("json");

      const data = await db
        .insert(channels)
        .values({
          id: createId(),
          orgId: values.orgId,
          name: values.name,
        })
        .returning({
          id: channels.id,
          name: channels.name,
        });

      const channelId = data[0].id;

      if (values.users && values.users.length > 0) {
        const userChannelEntries = values.users.map((userId) => ({
          userId,
          channelId,
          orgId: values.orgId,
        }));

        await db.insert(usersToChannels).values(userChannelEntries);
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

      await db
        .update(usersToChannels)
        .set({
          recordStatus: "deleted",
        })
        .where(inArray(usersToChannels.channelId, values.ids));

      const data = await db
        .update(channels)
        .set({
          recordStatus: "deleted",
        })
        .where(inArray(channels.id, values.ids));

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
        orgId: z.string(),
        users: z.array(z.string()),
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
        .update(channels)
        .set({
          name: values.name,
        })
        .where(eq(channels.id, id))
        .returning({
          id: channels.id,
          name: channels.name,
        });

      await db.delete(usersToChannels).where(eq(usersToChannels.channelId, id));

      if (values.users && values.users.length > 0) {
        const newUserChannelEntries = values.users.map((userId) => ({
          userId,
          channelId: id,
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

      await db
        .update(usersToChannels)
        .set({
          recordStatus: "deleted",
        })
        .where(eq(usersToChannels.channelId, id));

      const [data] = await db
        .update(channels)
        .set({
          recordStatus: "deleted",
        })
        .where(eq(channels.id, id));

      return c.json({ data });
    }
  );

export default app;
