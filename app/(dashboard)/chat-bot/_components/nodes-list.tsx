"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

import { Item } from "./item";

import { Bot } from "lucide-react";
import { useGetNodes } from "@/features/nodes/api/use-get-nodes";

export const NodesList = ({
  parentBotId,
  level = 1,
}: {
  parentBotId: string;
  level: number;
}) => {
  const params = useParams();
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const nodesQuery = useGetNodes(parentBotId);
  const nodes = nodesQuery.data;

  const onExpand = (nodeId: string) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [nodeId]: !prevExpanded[nodeId],
    }));
  };

  const onRedirect = (nodeId: string) => {
    router.push(`/chat-bot/${parentBotId}/${nodeId}`);
  };

  if (nodes === undefined) {
    return (
      <>
        <Item.Skeleton />
        {level === 0 && (
          <>
            <Item.Skeleton />
            <Item.Skeleton />
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
          expanded && "last:block"
        )}
      >
        No nodes inside
      </p>
      {nodes?.map((node) => (
        <div key={node.id}>
          <Item
            id={node.id}
            onClick={() => onRedirect(node.id)}
            label={node.name}
            level={level + 1}
            icon={Bot}
            active={params.nodeId === node.id}
            onExpand={() => onExpand(node.id)}
            expanded={expanded[node.id]}
            onCreate={() => {}}
          />
          {expanded[node.id] && "Nodes"}
        </div>
      ))}
    </>
  );
};
