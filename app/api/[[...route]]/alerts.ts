import { db } from "@/db/drizzle";
import {
  alerts,
  templates,
  abundantCarts,
  receiverGift,
  bankTransfer,
  newLogin,
  messages,
  errorMessages,
  payOnReceive,
} from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono()
  .get("/", clerkMiddleware(), async (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json(
        {
          error: "Unauthorized",
        },
        401
      );
    }

    const data = await db
      .select({
        id: alerts.id,
        sr: alerts.sr,
        name: alerts.name,
        active: alerts.active,
        statusCode: alerts.statusCode,
        to: alerts.to,
        template: templates.name,
        time: alerts.time,
        scheduledDays: alerts.scheduledDays,
        scheduledHours: alerts.scheduledHours,
        scheduledMinutes: alerts.scheduledMinutes,
      })
      .from(alerts)
      .innerJoin(templates, eq(alerts.templateId, templates.id))
      .where(eq(alerts.userId, auth.userId));

    return c.json({ data });
  })
  .get("/abandant-carts", clerkMiddleware(), async (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json(
        {
          error: "Unauthorized",
        },
        401
      );
    }

    const data = await db
      .select({
        id: abundantCarts.id,
        sr: abundantCarts.sr,
        name: abundantCarts.name,
        active: abundantCarts.active,
        statusCode: abundantCarts.statusCode,
        template: templates.name,
        time: abundantCarts.time,
        scheduledDays: abundantCarts.scheduledDays,
        scheduledHours: abundantCarts.scheduledHours,
        scheduledMinutes: abundantCarts.scheduledMinutes,
        city: abundantCarts.city,
        minCartValue: abundantCarts.minCartValue,
        maxCartValue: abundantCarts.maxCartValue,
      })
      .from(abundantCarts)
      .innerJoin(templates, eq(abundantCarts.templateId, templates.id))
      .where(eq(abundantCarts.userId, auth.userId));

    return c.json({ data });
  })
  .get("/receiver-gift", clerkMiddleware(), async (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json(
        {
          error: "Unauthorized",
        },
        401
      );
    }

    const data = await db
      .select({
        id: receiverGift.id,
        sr: receiverGift.sr,
        alert: alerts.name,
        messageAfterFirstButton: messages.id,
        messageAfterSecondButton: messages.id,
        errorMessage: errorMessages.id,
        statusErrorMessage: errorMessages.id,
        scheduledDays: receiverGift.scheduledDays,
        scheduledHours: receiverGift.scheduledHours,
        scheduledMinutes: receiverGift.scheduledMinutes,
        time: receiverGift.time,
      })
      .from(receiverGift)
      .innerJoin(alerts, eq(receiverGift.alertId, alerts.id))
      .innerJoin(
        messages,
        eq(receiverGift.messageAfterFirstButtonId, messages.id)
      )
      .innerJoin(
        messages,
        eq(receiverGift.messageAfterSecondButtonId, messages.id)
      )
      .innerJoin(
        errorMessages,
        eq(receiverGift.errorMessageId, errorMessages.id)
      )
      .innerJoin(
        errorMessages,
        eq(receiverGift.statusErrorMessageId, errorMessages.id)
      )
      .where(eq(receiverGift.userId, auth.userId));

    return c.json({ data });
  })
  .get("/pay-on-receive", clerkMiddleware(), async (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json(
        {
          error: "Unauthorized",
        },
        401
      );
    }

    const data = await db
      .select({
        id: payOnReceive.id,
        sr: payOnReceive.sr,
        confirmationStatus: payOnReceive.confirmationStatus,
        cancellationStatus: payOnReceive.cancellationStatus,
        alert: alerts.name,
        messageAfterFirstButton: messages.name,
        messageAfterSecondButton: messages.name,
        errorMessage: errorMessages.name,
        statusErrorMessage: errorMessages.name,
        scheduledDays: payOnReceive.scheduledDays,
        scheduledHours: payOnReceive.scheduledHours,
        scheduledMinutes: payOnReceive.scheduledMinutes,
        time: payOnReceive.time,
      })
      .from(payOnReceive)
      .innerJoin(alerts, eq(payOnReceive.alertId, alerts.id))
      .innerJoin(
        messages,
        eq(payOnReceive.messageAfterFirstButtonId, messages.id)
      )
      .innerJoin(
        messages,
        eq(payOnReceive.messageAfterSecondButtonId, messages.id)
      )
      .innerJoin(
        errorMessages,
        eq(payOnReceive.errorMessageId, errorMessages.id)
      )
      .innerJoin(
        errorMessages,
        eq(payOnReceive.statusErrorMessageId, errorMessages.id)
      )
      .where(eq(payOnReceive.userId, auth.userId));

    return c.json({ data });
  })
  .get("/bank-transfer", clerkMiddleware(), async (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json(
        {
          error: "Unauthorized",
        },
        401
      );
    }

    const data = await db
      .select({
        id: bankTransfer.id,
        sr: bankTransfer.sr,
        alert: alerts.name,
        messageAfterFirstButton: messages.name,
        messageAfterSecondButton: messages.name,
        errorMessage: errorMessages.name,
        statusErrorMessage: errorMessages.name,
        scheduledDays: bankTransfer.scheduledDays,
        scheduledHours: bankTransfer.scheduledHours,
        scheduledMinutes: bankTransfer.scheduledMinutes,
        time: bankTransfer.time,
      })
      .from(bankTransfer)
      .innerJoin(alerts, eq(bankTransfer.alertId, alerts.id))
      .innerJoin(
        messages,
        eq(bankTransfer.messageAfterFirstButtonId, messages.id)
      )
      .innerJoin(
        messages,
        eq(bankTransfer.messageAfterSecondButtonId, messages.id)
      )
      .innerJoin(
        errorMessages,
        eq(bankTransfer.errorMessageId, errorMessages.id)
      )
      .innerJoin(
        errorMessages,
        eq(bankTransfer.statusErrorMessageId, errorMessages.id)
      )
      .where(eq(bankTransfer.userId, auth.userId));

    return c.json({ data });
  })
  .get("/new-login", clerkMiddleware(), async (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json(
        {
          error: "Unauthorized",
        },
        401
      );
    }

    const data = await db
      .select({
        id: newLogin.id,
        sr: newLogin.sr,
        template: templates.name,
        alert: alerts.name,
        status: newLogin.status,
        scheduledDays: newLogin.scheduledDays,
        scheduledHours: newLogin.scheduledHours,
        scheduledMinutes: newLogin.scheduledMinutes,
        time: newLogin.time,
      })
      .from(newLogin)
      .innerJoin(templates, eq(newLogin.templateId, templates.id))
      .innerJoin(alerts, eq(newLogin.alertId, alerts.id))
      .where(eq(newLogin.userId, auth.userId));

    return c.json({ data });
  })
  .get(
    "/:id",
    zValidator("param", z.object({ id: z.string().optional() })),
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json(
          {
            error: "Missing id",
          },
          400
        );
      }

      if (!auth?.userId) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      const [data] = await db
        .select({
          id: alerts.id,
          name: alerts.name,
          statusCode: alerts.statusCode,
          to: alerts.to,
          templateId: alerts.templateId,
          time: alerts.time,
          scheduledDays: alerts.scheduledDays,
          scheduledHours: alerts.scheduledHours,
          scheduledMinutes: alerts.scheduledMinutes,
        })
        .from(alerts)
        .where(and(eq(alerts.userId, auth.userId), eq(alerts.id, id)));

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
  .get(
    "/abandant-carts/:id",
    zValidator("param", z.object({ id: z.string().optional() })),
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json(
          {
            error: "Missing id",
          },
          400
        );
      }

      if (!auth?.userId) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      const [data] = await db
        .select({
          id: abundantCarts.id,
          name: abundantCarts.name,
          active: abundantCarts.active,
          statusCode: abundantCarts.statusCode,
          templateId: abundantCarts.templateId,
          time: abundantCarts.time,
          scheduledDays: abundantCarts.scheduledDays,
          scheduledHours: abundantCarts.scheduledHours,
          scheduledMinutes: abundantCarts.scheduledMinutes,
          city: abundantCarts.city,
          minCartValue: abundantCarts.minCartValue,
          maxCartValue: abundantCarts.maxCartValue,
        })
        .from(abundantCarts)
        .where(
          and(eq(abundantCarts.userId, auth.userId), eq(abundantCarts.id, id))
        );

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
  .get(
    "/receiver-gift/:id",
    zValidator("param", z.object({ id: z.string().optional() })),
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json(
          {
            error: "Missing id",
          },
          400
        );
      }

      if (!auth?.userId) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      const [data] = await db
        .select({
          id: receiverGift.id,
          alertId: receiverGift.alertId,
          messageAfterFirstButtonId: receiverGift.messageAfterFirstButtonId,
          messageAfterSecondButtonId: receiverGift.messageAfterSecondButtonId,
          errorMessageId: receiverGift.errorMessageId,
          statusErrorMessageId: receiverGift.statusErrorMessageId,
          scheduledDays: receiverGift.scheduledDays,
          scheduledHours: receiverGift.scheduledHours,
          scheduledMinutes: receiverGift.scheduledMinutes,
          time: receiverGift.time,
        })
        .from(receiverGift)
        .where(
          and(eq(receiverGift.userId, auth.userId), eq(receiverGift.id, id))
        );

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
  .get(
    "/pay-on-receive/:id",
    zValidator("param", z.object({ id: z.string().optional() })),
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json(
          {
            error: "Missing id",
          },
          400
        );
      }

      if (!auth?.userId) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      const [data] = await db
        .select({
          id: payOnReceive.id,
          alertId: payOnReceive.alertId,
          confirmationStatus: payOnReceive.confirmationStatus,
          cancellationStatus: payOnReceive.cancellationStatus,
          messageAfterFirstButtonId: payOnReceive.messageAfterFirstButtonId,
          messageAfterSecondButtonId: payOnReceive.messageAfterSecondButtonId,
          errorMessageId: payOnReceive.errorMessageId,
          statusErrorMessageId: payOnReceive.statusErrorMessageId,
          scheduledDays: payOnReceive.scheduledDays,
          scheduledHours: payOnReceive.scheduledHours,
          scheduledMinutes: payOnReceive.scheduledMinutes,
          time: payOnReceive.time,
        })
        .from(payOnReceive)
        .where(
          and(eq(payOnReceive.userId, auth.userId), eq(payOnReceive.id, id))
        );

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
  .get(
    "/bank-transfer/:id",
    zValidator("param", z.object({ id: z.string().optional() })),
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json(
          {
            error: "Missing id",
          },
          400
        );
      }

      if (!auth?.userId) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      const [data] = await db
        .select({
          id: bankTransfer.id,
          alertId: bankTransfer.alertId,
          messageAfterFirstButtonId: bankTransfer.messageAfterFirstButtonId,
          messageAfterSecondButtonId: bankTransfer.messageAfterSecondButtonId,
          errorMessageId: bankTransfer.errorMessageId,
          statusErrorMessageId: bankTransfer.statusErrorMessageId,
          scheduledDays: bankTransfer.scheduledDays,
          scheduledHours: bankTransfer.scheduledHours,
          scheduledMinutes: bankTransfer.scheduledMinutes,
          time: bankTransfer.time,
        })
        .from(bankTransfer)
        .where(
          and(eq(bankTransfer.userId, auth.userId), eq(bankTransfer.id, id))
        );

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
  .get(
    "/new-login/:id",
    zValidator("param", z.object({ id: z.string().optional() })),
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json(
          {
            error: "Missing id",
          },
          400
        );
      }

      if (!auth?.userId) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      const [data] = await db
        .select({
          id: newLogin.id,
          templateId: newLogin.templateId,
          alertId: newLogin.alertId,
          status: newLogin.status,
          scheduledDays: newLogin.scheduledDays,
          scheduledHours: newLogin.scheduledHours,
          scheduledMinutes: newLogin.scheduledMinutes,
          time: newLogin.time,
        })
        .from(newLogin)
        .where(and(eq(newLogin.userId, auth.userId), eq(newLogin.id, id)));

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
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({
        name: z.string(),
        statusCode: z.string(),
        to: z.string(),
        templateId: z.string(),
        time: z.string(),
        scheduledDays: z.number().optional(),
        scheduledHours: z.number().optional(),
        scheduledMinutes: z.number().optional(),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      const [data] = await db
        .insert(alerts)
        .values({
          id: createId(),
          userId: auth.userId,
          name: values.name,
          statusCode: values.statusCode,
          to: values.to,
          templateId: values.templateId,
          time: values.time,
          scheduledDays: values.scheduledDays,
          scheduledHours: values.scheduledHours,
          scheduledMinutes: values.scheduledMinutes,
        })
        .returning();

      return c.json({ data });
    }
  )
  .post(
    "/abandant-carts",
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({
        name: z.string(),
        statusCode: z.string(),
        templateId: z.string(),
        time: z.string(),
        scheduledDays: z.number().optional(),
        scheduledHours: z.number().optional(),
        scheduledMinutes: z.number().optional(),
        city: z.string(),
        minCartValue: z.number(),
        maxCartValue: z.number(),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      const [data] = await db
        .insert(abundantCarts)
        .values({
          id: createId(),
          userId: auth.userId,
          name: values.name,
          statusCode: values.statusCode,
          templateId: values.templateId,
          time: values.time,
          scheduledDays: values.scheduledDays,
          scheduledHours: values.scheduledHours,
          scheduledMinutes: values.scheduledMinutes,
          city: values.city,
          minCartValue: values.minCartValue,
          maxCartValue: values.maxCartValue,
        })
        .returning();

      return c.json({ data });
    }
  )
  .post(
    "/receiver-gift",
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({
        alertId: z.string(),
        messageAfterFirstButtonId: z.string(),
        messageAfterSecondButtonId: z.string(),
        errorMessageId: z.string(),
        statusErrorMessageId: z.string(),
        time: z.string(),
        scheduledDays: z.number(),
        scheduledHours: z.number(),
        scheduledMinutes: z.number(),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      const [data] = await db
        .insert(receiverGift)
        .values({
          id: createId(),
          userId: auth.userId,
          alertId: values.alertId,
          messageAfterFirstButtonId: values.messageAfterFirstButtonId,
          messageAfterSecondButtonId: values.messageAfterSecondButtonId,
          errorMessageId: values.errorMessageId,
          statusErrorMessageId: values.statusErrorMessageId,
          scheduledDays: values.scheduledDays,
          scheduledHours: values.scheduledHours,
          scheduledMinutes: values.scheduledMinutes,
          time: values.time,
        })
        .returning();

      return c.json({ data });
    }
  )
  .post(
    "/pay-on-receive",
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({
        alertId: z.string(),
        messageAfterFirstButtonId: z.string(),
        messageAfterSecondButtonId: z.string(),
        errorMessageId: z.string(),
        statusErrorMessageId: z.string(),
        confirmationStatus: z.string(),
        cancellationStatus: z.string(),
        time: z.string(),
        scheduledDays: z.number(),
        scheduledHours: z.number(),
        scheduledMinutes: z.number(),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      const [data] = await db
        .insert(payOnReceive)
        .values({
          id: createId(),
          userId: auth.userId,
          alertId: values.alertId,
          messageAfterFirstButtonId: values.messageAfterFirstButtonId,
          messageAfterSecondButtonId: values.messageAfterSecondButtonId,
          errorMessageId: values.errorMessageId,
          statusErrorMessageId: values.statusErrorMessageId,
          confirmationStatus: values.confirmationStatus,
          cancellationStatus: values.cancellationStatus,
          scheduledDays: values.scheduledDays,
          scheduledHours: values.scheduledHours,
          scheduledMinutes: values.scheduledMinutes,
          time: values.time,
        })
        .returning();

      return c.json({ data });
    }
  )
  .post(
    "/bank-transfer",
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({
        alertId: z.string(),
        messageAfterFirstButtonId: z.string(),
        messageAfterSecondButtonId: z.string(),
        errorMessageId: z.string(),
        statusErrorMessageId: z.string(),
        time: z.string(),
        scheduledDays: z.number(),
        scheduledHours: z.number(),
        scheduledMinutes: z.number(),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      const [data] = await db
        .insert(bankTransfer)
        .values({
          id: createId(),
          userId: auth.userId,
          alertId: values.alertId,
          messageAfterFirstButtonId: values.messageAfterFirstButtonId,
          messageAfterSecondButtonId: values.messageAfterSecondButtonId,
          errorMessageId: values.errorMessageId,
          statusErrorMessageId: values.statusErrorMessageId,
          scheduledDays: values.scheduledDays,
          scheduledHours: values.scheduledHours,
          scheduledMinutes: values.scheduledMinutes,
          time: values.time,
        })
        .returning();

      return c.json({ data });
    }
  )
  .post(
    "/new-login",
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({
        templateId: z.string(),
        alertId: z.string(),
        status: z.string(),
        time: z.string(),
        scheduledDays: z.number(),
        scheduledHours: z.number(),
        scheduledMinutes: z.number(),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      const [data] = await db
        .insert(newLogin)
        .values({
          id: createId(),
          userId: auth.userId,
          templateId: values.templateId,
          status: values.status,
          alertId: values.alertId,
          scheduledDays: values.scheduledDays,
          scheduledHours: values.scheduledHours,
          scheduledMinutes: values.scheduledMinutes,
          time: values.time,
        })
        .returning();

      return c.json({ data });
    }
  )
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string().optional() })),
    zValidator(
      "json",
      z.object({
        name: z.string(),
        statusCode: z.string(),
        to: z.string(),
        templateId: z.string(),
        time: z.string(),
        scheduledDays: z.number(),
        scheduledHours: z.number(),
        scheduledMinutes: z.number(),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
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

      if (!auth?.userId) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      const alertsToUpdate = db.$with("alerts_to_update").as(
        db
          .select({ id: alerts.id })
          .from(alerts)
          .where(and(eq(alerts.id, id), eq(alerts.userId, auth.userId)))
      );

      const [data] = await db
        .with(alertsToUpdate)
        .update(alerts)
        .set({
          name: values.name,
          statusCode: values.statusCode,
          to: values.to,
          templateId: values.templateId,
          time: values.time,
          scheduledDays: values.scheduledDays,
          scheduledHours: values.scheduledHours,
          scheduledMinutes: values.scheduledMinutes,
        })
        .where(inArray(alerts.id, sql`(select id from ${alertsToUpdate})`))
        .returning({
          id: alerts.id,
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
  .patch(
    "/abandant-carts/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string().optional() })),
    zValidator(
      "json",
      z.object({
        name: z.string(),
        statusCode: z.string(),
        templateId: z.string(),
        time: z.string(),
        scheduledDays: z.number().optional(),
        scheduledHours: z.number().optional(),
        scheduledMinutes: z.number().optional(),
        city: z.string(),
        minCartValue: z.number(),
        maxCartValue: z.number(),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
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

      if (!auth?.userId) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      const abundantCartsToUpdate = db.$with("abundant_carts_to_update").as(
        db
          .select({ id: abundantCarts.id })
          .from(abundantCarts)
          .where(
            and(eq(abundantCarts.id, id), eq(abundantCarts.userId, auth.userId))
          )
      );

      const [data] = await db
        .with(abundantCartsToUpdate)
        .update(abundantCarts)
        .set({
          name: values.name,
          statusCode: values.statusCode,
          templateId: values.templateId,
          time: values.time,
          scheduledDays: values.scheduledDays,
          scheduledHours: values.scheduledHours,
          scheduledMinutes: values.scheduledMinutes,
          city: values.city,
          minCartValue: values.minCartValue,
          maxCartValue: values.maxCartValue,
        })
        .where(
          inArray(abundantCarts.id, sql`(select id from ${abundantCartsToUpdate})`)
        )
        .returning({
          id: abundantCarts.id,
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
  .patch(
    "/receiver-gift/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string().optional() })),
    zValidator(
      "json",
      z.object({
        alertId: z.string(),
        messageAfterFirstButtonId: z.string(),
        messageAfterSecondButtonId: z.string(),
        errorMessageId: z.string(),
        statusErrorMessageId: z.string(),
        time: z.string(),
        scheduledDays: z.number(),
        scheduledHours: z.number(),
        scheduledMinutes: z.number(),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
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

      if (!auth?.userId) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      const receiverGiftsToUpdate = db.$with("receiver_gifts_to_update").as(
        db
          .select({ id: receiverGift.id })
          .from(receiverGift)
          .where(
            and(eq(receiverGift.id, id), eq(receiverGift.userId, auth.userId))
          )
      );

      const [data] = await db
        .with(receiverGiftsToUpdate)
        .update(receiverGift)
        .set({
          alertId: values.alertId,
          messageAfterFirstButtonId: values.messageAfterFirstButtonId,
          messageAfterSecondButtonId: values.messageAfterSecondButtonId,
          errorMessageId: values.errorMessageId,
          statusErrorMessageId: values.statusErrorMessageId,
          scheduledDays: values.scheduledDays,
          scheduledHours: values.scheduledHours,
          scheduledMinutes: values.scheduledMinutes,
          time: values.time,
        })
        .where(
          inArray(receiverGift.id, sql`(select id from ${receiverGiftsToUpdate})`)
        )
        .returning({
          id: receiverGift.id,
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
  .patch(
    "/pay-on-receive/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string().optional() })),
    zValidator(
      "json",
      z.object({
        alertId: z.string(),
        messageAfterFirstButtonId: z.string(),
        messageAfterSecondButtonId: z.string(),
        errorMessageId: z.string(),
        statusErrorMessageId: z.string(),
        confirmationStatus: z.string(),
        cancellationStatus: z.string(),
        time: z.string(),
        scheduledDays: z.number(),
        scheduledHours: z.number(),
        scheduledMinutes: z.number(),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
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

      if (!auth?.userId) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      const payOnReceiveToUpdate = db.$with("pay_on_receive_to_update").as(
        db
          .select({ id: receiverGift.id })
          .from(receiverGift)
          .where(
            and(eq(receiverGift.id, id), eq(receiverGift.userId, auth.userId))
          )
      );

      const [data] = await db
        .with(payOnReceiveToUpdate)
        .update(payOnReceive)
        .set({
          alertId: values.alertId,
          messageAfterFirstButtonId: values.messageAfterFirstButtonId,
          messageAfterSecondButtonId: values.messageAfterSecondButtonId,
          errorMessageId: values.errorMessageId,
          statusErrorMessageId: values.statusErrorMessageId,
          confirmationStatus: values.confirmationStatus,
          cancellationStatus: values.cancellationStatus,
          scheduledDays: values.scheduledDays,
          scheduledHours: values.scheduledHours,
          scheduledMinutes: values.scheduledMinutes,
          time: values.time,
        })
        .where(
          inArray(payOnReceive.id, sql`(select id from ${payOnReceiveToUpdate})`)
        )
        .returning({
          id: payOnReceive.id,
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
  .patch(
    "/bank-transfer/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string().optional() })),
    zValidator(
      "json",
      z.object({
        alertId: z.string(),
        messageAfterFirstButtonId: z.string(),
        messageAfterSecondButtonId: z.string(),
        errorMessageId: z.string(),
        statusErrorMessageId: z.string(),
        time: z.string(),
        scheduledDays: z.number(),
        scheduledHours: z.number(),
        scheduledMinutes: z.number(),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
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

      if (!auth?.userId) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      const bankTransfersToUpdate = db.$with("bank_transfers_to_update").as(
        db
          .select({ id: bankTransfer.id })
          .from(bankTransfer)
          .where(
            and(eq(bankTransfer.id, id), eq(bankTransfer.userId, auth.userId))
          )
      );

      const [data] = await db
        .with(bankTransfersToUpdate)
        .update(bankTransfer)
        .set({
          alertId: values.alertId,
          messageAfterFirstButtonId: values.messageAfterFirstButtonId,
          messageAfterSecondButtonId: values.messageAfterSecondButtonId,
          errorMessageId: values.errorMessageId,
          statusErrorMessageId: values.statusErrorMessageId,
          scheduledDays: values.scheduledDays,
          scheduledHours: values.scheduledHours,
          scheduledMinutes: values.scheduledMinutes,
          time: values.time,
        })
        .where(
          inArray(
            bankTransfer.id,
            sql`(select id from ${bankTransfersToUpdate})`
          )
        )
        .returning({
          id: bankTransfer.id,
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
  .patch(
    "/new-login/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string().optional() })),
    zValidator(
      "json",
      z.object({
        templateId: z.string(),
        alertId: z.string(),
        status: z.string(),
        time: z.string(),
        scheduledDays: z.number(),
        scheduledHours: z.number(),
        scheduledMinutes: z.number(),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
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

      if (!auth?.userId) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      const newLoginsToUpdate = db.$with("new_logins_to_update").as(
        db
          .select({ id: newLogin.id })
          .from(newLogin)
          .where(and(eq(newLogin.id, id), eq(newLogin.userId, auth.userId)))
      );

      const [data] = await db
        .with(newLoginsToUpdate)
        .update(newLogin)
        .set({
          templateId: values.templateId,
          status: values.status,
          alertId: values.alertId,
          scheduledDays: values.scheduledDays,
          scheduledHours: values.scheduledHours,
          scheduledMinutes: values.scheduledMinutes,
          time: values.time,
        })
        .where(inArray(newLogin.id, sql`(select id from ${newLoginsToUpdate})`))
        .returning({
          id: newLogin.id,
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
