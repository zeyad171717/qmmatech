"use client";

import { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

import { Item } from "./item";

import { Bot } from "lucide-react";
import { useGetNodes } from "@/features/nodes/api/use-get-nodes";
import { useEditNode } from "@/features/nodes/api/use-edit-node";
import { SubNodesList } from "./sub-nodes-list";
import { useCreateNode } from "@/features/nodes/api/use-create-node";
import { Droppable, Draggable } from "@hello-pangea/dnd";

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

  const create = useCreateNode();

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

  const onCreate = (nodeId: string) => {
    create.mutate(
      { name: "Untitled", parentId: nodeId, botId: parentBotId },
      {
        // @ts-ignore
        onSuccess: ({ data }) => {
          router.push(`/chat-bot/${parentBotId}/${data.id}`);
        },
      }
    );
  };

  if (nodesQuery.isLoading) {
    return <Item.Skeleton />;
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
            onCreate={() => onCreate(node.id)}
          />
          {expanded[node.id] && (
            <SubNodesList
              parentId={node.id}
              level={level + 1}
              botId={parentBotId}
            />
          )}
        </div>
      ))}
    </>
  );
};
