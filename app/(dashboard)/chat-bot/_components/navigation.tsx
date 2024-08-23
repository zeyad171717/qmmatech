"use client";

import { useGetBots } from "@/features/bots/api/use-get-bots";
import { PlusCircle} from "lucide-react";
import { Item } from "./item";
import { useCreateBot } from "@/features/bots/api/use-create-bot";
import { useRouter } from "next/navigation";
import { BotsList } from "./bots-list";

export const Navigation = () => {
  const create = useCreateBot();
  const router = useRouter();

  const handleCreate = () => {
    create.mutate(
      { name: "Untitled" },
      {
        // @ts-ignore
        onSuccess: ({ data }) => {
          router.push(`/chat-bot/${data.id}`);
        },
      }
    );
  };

  return (
    <aside className="flex h-full w-60 flex-col overflow-y-auto bg-secondary">
      <div>
        <Item onClick={handleCreate} label="New bot" icon={PlusCircle} />
      </div>
      <div className="mt-4">
        <BotsList />        
      </div>
    </aside>
  );
};
