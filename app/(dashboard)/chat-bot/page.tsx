"use client";

import { Button } from "@/components/ui/button";
import { useCreateBot } from "@/features/bots/api/use-create-bot";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ChatbotPage = () => {
  const router = useRouter();
  const create = useCreateBot();

  const onCreate = () => {
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
    <div className="flex h-full flex-col items-center justify-center space-y-4">
      <Image
        src="/empty.svg"
        alt="empty"
        height="300"
        width="300"
        priority
        className="h-auto"
      />
      <Button onClick={onCreate}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Create a bot
      </Button>
    </div>
  );
};

export default ChatbotPage;
