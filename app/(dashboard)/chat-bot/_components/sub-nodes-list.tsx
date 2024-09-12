"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { Item } from "./item";

import { Bot } from "lucide-react";

import { useGetSubNodes } from "@/features/nodes/api/use-get-sub-nodes";
import { useCreateNode } from "@/features/nodes/api/use-create-node";
import { useEditNode } from "@/features/nodes/api/use-edit-node";
import { Droppable, Draggable } from "@hello-pangea/dnd";

export const SubNodesList = ({
  parentId,
  level = 2,
  botId,
}: {
  parentId: string;
  level: number;
  botId: string;
}) => {
  const params = useParams();
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const create = useCreateNode();

  const nodesQuery = useGetSubNodes(parentId);
  const nodes = nodesQuery.data;

  const onExpand = (nodeId: string) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [nodeId]: !prevExpanded[nodeId],
    }));
  };

  const onRedirect = (nodeId: string) => {
    router.push(`/chat-bot/${botId}/${nodeId}`);
  };

  const onCreate = (nodeId: string) => {
    create.mutate(
      { name: "Untitled", parentId: nodeId, botId: botId },
      {
        // @ts-ignore
        onSuccess: ({ data }) => {
          router.push(`/chat-bot/${botId}/${data.id}`);
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
        No sub nodes inside
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
            <SubNodesList parentId={node.id} level={level + 1} botId={botId} />
          )}
        </div>
      ))}
    </>
  );
};
