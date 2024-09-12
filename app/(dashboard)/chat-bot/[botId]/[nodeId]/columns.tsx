"use client";

import { ColumnDef } from "@tanstack/react-table";

import { InferResponseType } from "hono";
import { client } from "@/lib/hono";

import { Actions } from "./actions";
export type ResponseType = InferResponseType<
  (typeof client.api.nodes)["sub-nodes"][":parentId"],
  200
>["data"][0];

export const columns: ColumnDef<ResponseType>[] = [
  {
    accessorKey: "index",
    cell: ({ row }) => {
      const { id, index } = row.original;

      return <Actions id={id} index={index} />
    },
    header: "Index",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
];
