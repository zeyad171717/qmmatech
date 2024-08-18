"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

import { Item } from "./item";

import { FileIcon } from "lucide-react";
import { useGetBots } from "@/features/bots/api/use-get-bots";
import React from "react";

interface BotsListProps {
  parentBotId?: string;
  level?: number;
}

export const BotsList = ({ parentBotId, level = 0 }: BotsListProps) => {
  const params = useParams();
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const onExpand = (botId: string) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [botId]: !prevExpanded[botId],
    }));
  };

  const botsQuery = useGetBots();
  const bots = botsQuery.data;

  const onRedirect = (botId: string) => {
    router.push(`/chat-bot/${botId}`);
  };

  if (bots === undefined) {
    return (
      <>
        <Item.Skeleton level={level} />
        {level === 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    );
  }

  return (
    <>
      <p
        style={{ paddingLeft: level ? `${level * 12 + 25}px` : undefined }}
        className={cn(
          "hidden text-sm font-medium text-muted-foreground/80",
          expanded && "last:block",
          level === 0 && "hidden"
        )}
      >
        No bots inside
      </p>
      {bots?.map((bot) => (
        <div key={bot.bots.id}>
          <Item
            id={bot.bots.id}
            onClick={() => onRedirect(bot.bots.id)}
            label={bot.bots.name}
            icon={FileIcon}
            active={params.botId === bot.bots.id}
            level={level}
            onExpand={() => onExpand(bot.bots.id)}
            expanded={expanded[bot.bots.id]}
          />
          {expanded[bot.bots.id] && (
            <BotsList parentBotId={bot.bots.id} level={level + 1} />
          )}
        </div>
      ))}
    </>
  );
};
