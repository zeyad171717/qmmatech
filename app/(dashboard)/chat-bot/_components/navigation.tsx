"use client";

import { useGetBots } from "@/features/bots/api/use-get-bots";
import { PlusCircle, Search, Settings } from "lucide-react";
import { Item } from "./item";
import { useCreateBot } from "@/features/bots/api/use-create-bot";
import { useRouter } from "next/navigation";
import { useSearch } from "@/features/bots/hooks/use-search";
import { useSettings } from "@/features/bots/hooks/use-settings";

export const Navigation = () => {
  const search = useSearch();
  const settings = useSettings();
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
        <Item label="Search" icon={Search} isSearch onClick={search.onOpen} />
        <Item label="Settings" icon={Settings} onClick={settings.onOpen} />{" "}
        <Item onClick={handleCreate} label="New bot" icon={PlusCircle} />
      </div>
      <div className="mt-4">
        
      </div>
    </aside>
  );
};
