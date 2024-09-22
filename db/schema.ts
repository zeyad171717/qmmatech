import { createInsertSchema } from "drizzle-zod";
import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { z } from "zod";

export const contacts = pgTable("contacts", {
  id: text("id").primaryKey(),
  phone: text("phone").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  hasWhatsApp: boolean("has_whatsapp").default(true),
  blockedCampaigns: boolean("blocked_campaigns").default(false),
  blockedFromBot: boolean("blocked_from_bot").default(false),
  blockedFromCC: boolean("blocked_from_cc").default(false),
});

export const lists = pgTable("lists", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  status: text("status").default("running"),
  recordStatus: text("record_status").default("created"),
  creationDate: timestamp("creation_date", { mode: "date" })
    .notNull()
    .defaultNow(),
  campaignId: text("campaign_id")
    .references(() => campaigns.id)
    .notNull(),
  sendingType: text("sendingType"),
  ignoreCustomersReceivedMessageWithin: text(
    "ignoreCustomersReceiveMessageWithin"
  ),
  dailyLimit: integer("dailyLimit"),
  dailySendingLimit: integer("dailySendingLimit"),
  fromSr: integer("fromSr"),
  toSr: integer("toSr"),
  type: text("type"),
  scheduleDate: timestamp("scheduleDate", { mode: "date" }),
});
export const listsRelations = relations(lists, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [lists.campaignId],
    references: [campaigns.id],
  }),
}));

export const campaigns = pgTable("campaigns", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  status: text("status").default("Running"),
  recordStatus: text("record_status").default("created"),
  creationDate: timestamp("creation_date", { mode: "date" })
    .notNull()
    .defaultNow(),
  excel: text("excel").notNull(),
});
export const campaignsRelations = relations(campaigns, ({ many }) => ({
  lists: many(lists),
}));

export const templateTypes = pgTable("templateTypes", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});
export const templateTypesRelations = relations(templateTypes, ({ many }) => ({
  templates: many(templates),
}));

export const templateLanguages = pgTable("templateLanguages", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});
export const templateLanguagesRelations = relations(
  templateLanguages,
  ({ many }) => ({
    templates: many(templates),
  })
);

export const templateHeaders = pgTable("templateHeaders", {
  id: text("id").primaryKey(),
  text: text("text"),
  typeId: text("typeId").notNull(),
});
export const templateHeadersRelations = relations(
  templateHeaders,
  ({ one }) => ({
    type: one(templateHeaderTypes, {
      fields: [templateHeaders.typeId],
      references: [templateHeaderTypes.id],
    }),
    template: one(templates),
  })
);

export const templateHeaderTypes = pgTable("templateHeaderTypes", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});
export const templateHeaderTypesRelations = relations(
  templateHeaderTypes,
  ({ many }) => ({
    templateHeaders: many(templateHeaders),
  })
);

export const templateFooters = pgTable("templateFooters", {
  id: text("id").primaryKey(),
  text: text("text").notNull(),
});
export const templateFootersRelations = relations(
  templateFooters,
  ({ one }) => ({ template: one(templates) })
);

export const templateCategories = pgTable("templateCategories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});
export const templateCategoriesRelations = relations(
  templateCategories,
  ({ many }) => ({
    templates: many(templates),
  })
);

export const templateButtons = pgTable("templateButtons", {
  id: text("id").primaryKey(),
  text: text("text").notNull(),
  url: text("url"),
  phonenumber: text("phonenumber"),
  typeId: integer("typeId").notNull(),
  templateId: integer("templateId"),
});
export const templateButtonsRelations = relations(
  templateButtons,
  ({ one }) => ({
    type: one(templateButtonTypes, {
      fields: [templateButtons.typeId],
      references: [templateButtonTypes.id],
    }),
    template: one(templates, {
      fields: [templateButtons.templateId],
      references: [templates.id],
    }),
  })
);

export const templateButtonTypes = pgTable("templateButtonTypes", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});
export const templateButtonTypesRelations = relations(
  templateButtonTypes,
  ({ many }) => ({
    templateButton: many(templateButtons),
  })
);

export const templates = pgTable("templates", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  allowCategoryChange: boolean("allowCategoryChange").notNull(),
  categoryId: text("categoryId").notNull(),
  typeId: text("typeId").notNull(),
  languageId: text("languageId").notNull(),
  headerId: text("headerId"),
  bodyMessage: text("bodyMessage").notNull(),
  footerId: text("footerId"),
  status: text("status").default("Pending"),
  recordStatus: text("record_status").default("created"),
  creationDate: timestamp("creation_date", { mode: "date" })
    .notNull()
    .defaultNow(),
});
export const templatesRelations = relations(templates, ({ one, many }) => ({
  category: one(templateCategories, {
    fields: [templates.categoryId],
    references: [templateCategories.id],
  }),
  type: one(templateTypes, {
    fields: [templates.typeId],
    references: [templateTypes.id],
  }),
  language: one(templateLanguages, {
    fields: [templates.languageId],
    references: [templateLanguages.id],
  }),
  header: one(templateHeaders, {
    fields: [templates.headerId],
    references: [templateHeaders.id],
  }),
  footer: one(templateFooters, {
    fields: [templates.footerId],
    references: [templateFooters.id],
  }),
  buttons: many(templateButtons),
}));

export const messages = pgTable("messages", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  bodyMessage: text("bodyMessage").notNull(),
  bodyEnding: text("bodyEnding"),
  header: boolean("header").notNull(),
  headerType: text("headerType"),
  headerText: text("headerText"),
  footer: boolean("footer").notNull(),
  footerText: text("footerText"),
  status: text("status").default("Pending"),
  recordStatus: text("record_status").default("created"),
  creationDate: timestamp("creation_date", { mode: "date" })
    .notNull()
    .defaultNow(),
});
export const messagesRelations = relations(messages, ({ one, many }) => ({
  buttons: many(templateButtons),
  node: one(nodes),
  bot: one(bots),
}));

export const errorMessages = pgTable("errorMessages", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  bodyMessage: text("bodyMessage").notNull(),
  bodyEnding: text("bodyEnding"),
  header: boolean("header").notNull(),
  headerType: text("headerType"),
  headerText: text("headerText"),
  footer: boolean("footer").notNull(),
  footerText: text("footerText"),
  status: text("status").default("Pending"),
  recordStatus: text("record_status").default("created"),
  creationDate: timestamp("creation_date", { mode: "date" })
    .notNull()
    .defaultNow(),
});
export const errorMessagesRelations = relations(
  errorMessages,
  ({ one, many }) => ({
    buttons: many(templateButtons),
    node: one(nodes),
    bot: one(bots),
  })
);

export const linkedMessages = pgTable("linkedMessages", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  bodyMessage: text("bodyMessage").notNull(),
  bodyEnding: text("bodyEnding"),
  header: boolean("header").notNull(),
  headerType: text("headerType"),
  headerText: text("headerText"),
  footer: boolean("footer").notNull(),
  footerText: text("footerText"),
  status: text("status").default("Pending"),
  recordStatus: text("record_status").default("created"),
  creationDate: timestamp("creation_date", { mode: "date" })
    .notNull()
    .defaultNow(),
  nodeId: text("nodeId"),
  botId: text("botId"),
  activated: boolean("activated").default(true),
  position: text("position").notNull(),
});
export const linkedMessagesRelations = relations(
  linkedMessages,
  ({ one, many }) => ({
    buttons: many(templateButtons),
    node: one(nodes, {
      fields: [linkedMessages.nodeId],
      references: [nodes.id],
    }),
    bot: one(bots, {
      fields: [linkedMessages.botId],
      references: [bots.id],
    }),
  })
);

export const interactiveWords = pgTable("interactiveWords", {
  id: text("id").primaryKey(),
  word: text("word").notNull(),
  filter: text("filter").notNull(),
  status: text("status").default("Pending"),
  recordStatus: text("record_status").default("created"),
  creationDate: timestamp("creation_date", { mode: "date" })
    .notNull()
    .defaultNow(),
  nodeId: text("nodeId"),
  botId: text("botId"),
  messageId: text("messageId").notNull(),
});
export const interactiveWordsRelations = relations(
  interactiveWords,
  ({ one }) => ({
    node: one(nodes, {
      fields: [interactiveWords.nodeId],
      references: [nodes.id],
    }),
    bot: one(bots, {
      fields: [interactiveWords.botId],
      references: [bots.id],
    }),
    message: one(messages, {
      fields: [interactiveWords.messageId],
      references: [messages.id],
    }),
  })
);

export const bots = pgTable("bots", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  messageId: text("messageId").notNull(),
  errorMessageId: text("errorMessageId").notNull(),
});
export const botsRelations = relations(bots, ({ many, one }) => ({
  nodes: many(nodes),
  message: one(messages, {
    fields: [bots.messageId],
    references: [messages.id],
  }),
  errorMessage: one(errorMessages, {
    fields: [bots.errorMessageId],
    references: [errorMessages.id],
  }),
}));

export const nodes = pgTable("nodes", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  botId: text("botId").notNull(),
  messageId: text("messageId").notNull(),
  errorMessageId: text("errorMessageId").notNull(),
  parentId: text("parentId"),
  index: integer("index"),
});
export const nodesRelations = relations(nodes, ({ one, many }) => ({
  bot: one(bots, {
    fields: [nodes.botId],
    references: [bots.id],
  }),
  message: one(messages, {
    fields: [nodes.messageId],
    references: [messages.id],
  }),
  errorMessage: one(errorMessages, {
    fields: [nodes.errorMessageId],
    references: [errorMessages.id],
  }),
  parent: one(nodes, {
    fields: [nodes.parentId],
    references: [nodes.id],
  }),
  linkedMessages: many(linkedMessages),
}));

export const alerts = pgTable("alerts", {
  id: text("id").primaryKey(),
  sr: serial("sr"),
  statusCode: text("status_code").notNull(),
  name: text("name").notNull(),
  time: text("time").notNull(),
  scheduledDays: integer("scheduledDays"),
  scheduledHours: integer("scheduledHours"),
  scheduledMinutes: integer("scheduledMinutes"),
  to: text("to").notNull(),
  templateId: text("templateId").notNull(),
  active: boolean("active").default(true),
});
export const alertsRelations = relations(alerts, ({ one, many }) => ({
  template: one(templates, {
    fields: [alerts.templateId],
    references: [templates.id],
  }),
}));

export const abundantCarts = pgTable("abundantCarts", {
  id: text("id").primaryKey(),
  sr: serial("sr"),
  statusCode: text("status_code").notNull(),
  name: text("name").notNull(),
  time: text("time").notNull(),
  scheduledDays: integer("scheduledDays"),
  scheduledHours: integer("scheduledHours"),
  scheduledMinutes: integer("scheduledMinutes"),
  templateId: text("templateId").notNull(),
  active: boolean("active").default(true),
  minCartValue: integer("minCartValue").notNull(),
  maxCartValue: integer("maxCartValue").notNull(),
  city: text("city").notNull(),
});
export const abundantCartsRelations = relations(
  abundantCarts,
  ({ one, many }) => ({
    template: one(templates, {
      fields: [abundantCarts.templateId],
      references: [templates.id],
    }),
  })
);

export const receiverGift = pgTable("receiverGift", {
  id: text("id").primaryKey(),
  sr: serial("sr"),
  alertId: text("alertId").notNull(),
  messageAfterFirstButtonId: text("messageAfterFirstButtonId").notNull(),
  messageAfterSecondButtonId: text("messageAfterSecondButtonId").notNull(),
  errorMessageId: text("errorMessageId").notNull(),
  statusErrorMessageId: text("statusErrorMessageId").notNull(),
  scheduledDays: integer("scheduledDays"),
  scheduledHours: integer("scheduledHours"),
  scheduledMinutes: integer("scheduledMinutes"),
  time: text("time").notNull(),
});
export const receiverGiftRelations = relations(
  receiverGift,
  ({ one, many }) => ({
    alert: one(alerts, {
      fields: [receiverGift.alertId],
      references: [alerts.id],
    }),
    messageAfterFirstButton: one(messages, {
      fields: [receiverGift.messageAfterFirstButtonId],
      references: [messages.id],
    }),
    messageAfterSecondButton: one(messages, {
      fields: [receiverGift.messageAfterSecondButtonId],
      references: [messages.id],
    }),
    errorMessage: one(errorMessages, {
      fields: [receiverGift.errorMessageId],
      references: [errorMessages.id],
    }),
    statusErrorMessage: one(errorMessages, {
      fields: [receiverGift.statusErrorMessageId],
      references: [errorMessages.id],
    }),
  })
);

export const payOnReceive = pgTable("payOnReceive", {
  id: text("id").primaryKey(),
  sr: serial("sr"),
  alertId: text("alertId").notNull(),
  messageAfterFirstButtonId: text("messageAfterFirstButtonId").notNull(),
  messageAfterSecondButtonId: text("messageAfterSecondButtonId").notNull(),
  errorMessageId: text("errorMessageId").notNull(),
  statusErrorMessageId: text("statusErrorMessageId").notNull(),
  confirmationStatus: text("confirmationStatus").notNull(),
  cancellationStatus: text("cancellationStatus").notNull(),
  scheduledDays: integer("scheduledDays"),
  scheduledHours: integer("scheduledHours"),
  scheduledMinutes: integer("scheduledMinutes"),
  time: text("time").notNull(),
});
export const payOnReceiveRelations = relations(
  payOnReceive,
  ({ one, many }) => ({
    alert: one(alerts, {
      fields: [payOnReceive.alertId],
      references: [alerts.id],
    }),
    messageAfterFirstButton: one(messages, {
      fields: [payOnReceive.messageAfterFirstButtonId],
      references: [messages.id],
    }),
    messageAfterSecondButton: one(messages, {
      fields: [payOnReceive.messageAfterSecondButtonId],
      references: [messages.id],
    }),
    errorMessage: one(errorMessages, {
      fields: [payOnReceive.errorMessageId],
      references: [errorMessages.id],
    }),
    statusErrorMessage: one(errorMessages, {
      fields: [payOnReceive.statusErrorMessageId],
      references: [errorMessages.id],
    }),
  })
);

export const bankTransfer = pgTable("bankTransfer", {
  id: text("id").primaryKey(),
  sr: serial("sr"),
  alertId: text("alertId").notNull(),
  messageAfterFirstButtonId: text("messageAfterFirstButtonId").notNull(),
  messageAfterSecondButtonId: text("messageAfterSecondButtonId").notNull(),
  errorMessageId: text("errorMessageId").notNull(),
  statusErrorMessageId: text("statusErrorMessageId").notNull(),
  scheduledDays: integer("scheduledDays"),
  scheduledHours: integer("scheduledHours"),
  scheduledMinutes: integer("scheduledMinutes"),
  time: text("time").notNull(),
});
export const bankTransferRelations = relations(
  bankTransfer,
  ({ one, many }) => ({
    alert: one(alerts, {
      fields: [bankTransfer.alertId],
      references: [alerts.id],
    }),
    messageAfterFirstButton: one(messages, {
      fields: [bankTransfer.messageAfterFirstButtonId],
      references: [messages.id],
    }),
    messageAfterSecondButton: one(messages, {
      fields: [bankTransfer.messageAfterSecondButtonId],
      references: [messages.id],
    }),
    errorMessage: one(errorMessages, {
      fields: [bankTransfer.errorMessageId],
      references: [errorMessages.id],
    }),
    statusErrorMessage: one(errorMessages, {
      fields: [bankTransfer.statusErrorMessageId],
      references: [errorMessages.id],
    }),
  })
);

export const newLogin = pgTable("newLogin", {
  id: text("id").primaryKey(),
  sr: serial("sr"),
  alertId: text("alertId").notNull(),
  templateId: text("templateId").notNull(),
  status: text("status").notNull(),
  scheduledDays: integer("scheduledDays"),
  scheduledHours: integer("scheduledHours"),
  scheduledMinutes: integer("scheduledMinutes"),
  time: text("time").notNull(),
});
export const newLoginRelations = relations(newLogin, ({ one, many }) => ({
  alert: one(alerts, {
    fields: [newLogin.alertId],
    references: [alerts.id],
  }),
  template: one(templates, {
    fields: [newLogin.templateId],
    references: [templates.id],
  }),
}));

export const permissions = pgTable("permissions", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  recordStatus: text("recordStatus").default("created"),
});
export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolesToPermissions: many(rolesToPermissions),
}));

export const roles = pgTable("roles", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  recordStatus: text("recordStatus").default("created"),
});
export const rolesRelations = relations(roles, ({ many }) => ({
  rolesToPermissions: many(rolesToPermissions),
  users: many(users),
}));

export const rolesToPermissions = pgTable(
  "roles_to_permissions",
  {
    roleId: text("role_id")
      .notNull()
      .references(() => roles.id),
    permissionId: text("permission_id")
      .notNull()
      .references(() => permissions.id),
    status: text("status").default("active"),
    orgId: text("orgId").notNull(),
    recordStatus: text("recordStatus").default("created"),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.roleId, t.permissionId] }),
  })
);
export const rolesToPermissionsRelations = relations(
  rolesToPermissions,
  ({ one }) => ({
    permission: one(permissions, {
      fields: [rolesToPermissions.permissionId],
      references: [permissions.id],
    }),
    role: one(roles, {
      fields: [rolesToPermissions.roleId],
      references: [roles.id],
    }),
  })
);

export const organizations = pgTable("organizations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  city: text("city").notNull(),
  phone: text("phone").notNull(),
  recordStatus: text("recordStatus").default("created"),
});

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  orgId: text("orgId"),
  roleId: text("roleId")
    .notNull()
    .references(() => roles.id),
  username: text("username").notNull(),
  imgUrl: text("imgUrl"),
  status: text("status").notNull(),
  language: text("language").notNull(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  phoneNumber: text("phoneNumber").notNull(),
  recordStatus: text("recordStatus").default("created"),
});
export const usersRelations = relations(users, ({ one, many }) => ({
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
  teamsToUsers: many(teamsToUsers),
  usersToChannels: many(usersToChannels),
}));

export const teams = pgTable("teams", {
  id: text("id").primaryKey(),
  orgId: text("orgId"),
  name: text("name").notNull(),
  recordStatus: text("recordStatus").default("created"),
});
export const teamsRelations = relations(teams, ({ many }) => ({
  teamsToUsers: many(teamsToUsers),
}));

export const teamsToUsers = pgTable(
  "teams_to_users",
  {
    teamId: text("team_id")
      .notNull()
      .references(() => teams.id),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    orgId: text("orgId").notNull(),
    recordStatus: text("recordStatus").default("created"),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.teamId, t.userId] }),
  })
);
export const teamsToUsersRelations = relations(teamsToUsers, ({ one }) => ({
  team: one(teams, {
    fields: [teamsToUsers.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [teamsToUsers.userId],
    references: [users.id],
  }),
}));

export const channels = pgTable("channels", {
  id: text("id").primaryKey(),
  orgId: text("orgId"),
  name: text("name").notNull(),
  recordStatus: text("recordStatus").default("created"),
});
export const channelsRelations = relations(channels, ({ many }) => ({
  usersToChannels: many(usersToChannels),
}));

export const usersToChannels = pgTable(
  "users_to_channels",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    channelId: text("channel_id")
      .notNull()
      .references(() => channels.id),
    orgId: text("orgId").notNull(),
    recordStatus: text("recordStatus").default("created"),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.channelId] }),
  })
);
export const usersToChannelsRelations = relations(
  usersToChannels,
  ({ one }) => ({
    user: one(users, {
      fields: [usersToChannels.userId],
      references: [users.id],
    }),
    channel: one(channels, {
      fields: [usersToChannels.channelId],
      references: [channels.id],
    }),
  })
);

export const insertContactSchema = createInsertSchema(contacts);
export const insertListSchema = createInsertSchema(lists, {
  creationDate: z.coerce.date(),
});
export const insertCampaignSchema = createInsertSchema(campaigns, {
  creationDate: z.coerce.date(),
});
export const insertBotSchema = createInsertSchema(bots);
export const insertNodeSchema = createInsertSchema(nodes);
