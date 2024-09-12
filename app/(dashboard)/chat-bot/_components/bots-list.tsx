"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

import { Item } from "./item";

import { Bot } from "lucide-react";
import { useGetBots } from "@/features/bots/api/use-get-bots";
import { useEditBot } from "@/features/bots/api/use-edit-bot";
import { NodesList } from "./nodes-list";
import { useCreateNode } from "@/features/nodes/api/use-create-node";

export const BotsList = () => {
  const params = useParams();
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const create = useCreateNode();

  const botsQuery = useGetBots();
  const bots = botsQuery.data;

  const onExpand = (botId: string) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [botId]: !prevExpanded[botId],
    }));
  };

  const onRedirect = (botId: string) => {
    router.push(`/chat-bot/${botId}`);
  };

  const onCreate = (botId: string) => {
    create.mutate(
      { name: "Untitled", botId },
      {
        // @ts-ignore
        onSuccess: ({ data }) => {
          router.push(`/chat-bot/${botId}/${data.id}`);
        },
      }
    );
  };

  if (botsQuery.isLoading) {
    return (
      <>
        <Item.Skeleton />
        <Item.Skeleton />
        <Item.Skeleton />
      </>
    );
  }

  return (
    <>
      <p
        style={{ paddingLeft: "25px" }}
        className={cn(
          "hidden text-sm font-medium text-muted-foreground/80",
          expanded && "last:block"
        )}
      >
        No bots
      </p>
      {bots?.map((bot) => (
        <div key={bot.id}>
          <Item
            id={bot.id}
            onClick={() => onRedirect(bot.id)}
            label={bot.name}
            icon={Bot}
            active={params.botId === bot.id}
            onExpand={() => onExpand(bot.id)}
            expanded={expanded[bot.id]}
            onCreate={() => onCreate(bot.id)}
            isBot
          />
          {expanded[bot.id] && <NodesList parentBotId={bot.id} level={1} />}
        </div>
      ))}
    </>
  );
};
