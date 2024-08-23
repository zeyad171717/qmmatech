import { Hono } from "hono";
import { handle } from "hono/vercel";
import contacts from "./contacts";
import campaigns from "./campaigns";
import lists from "./lists";
import templates from "./templates";
import messages from "./messages";
import bots from "./bots";
import nodes from "./nodes";

export const runtime = "edge";

const app = new Hono().basePath("/api");

const routes = app
  .route("/contacts", contacts)
  .route("/campaigns", campaigns)
  .route("/lists", lists)
  .route("/templates", templates)
  .route("/messages", messages)
  .route("/bots", bots)
  .route("/nodes", nodes);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
