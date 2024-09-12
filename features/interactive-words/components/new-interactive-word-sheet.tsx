import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useNewInteractiveWord } from "../hooks/use-new-interactive-word";
import { useCreateInteractiveWord } from "../api/use-create-interactive-word";
import { useGetMessageHeaderTypes } from "@/features/messages/api/use-get-message-header-types";
import { InteractiveWordForm } from "./interactive-word-form";
import { useGetMessages } from "@/features/messages/api/use-get-messages";

const formSchema = z.object({
  word: z.string(),
  filter: z.string(),
  messageId: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export const NewInteractiveWordSheet = () => {
  const { isOpen, onClose, nodeId } = useNewInteractiveWord();

  const createMutation = useCreateInteractiveWord();

  const messagesQuery = useGetMessages();
  const messageOptions =
    messagesQuery.data?.map((message) => ({
      label: message.name,
      value: message.id,
    })) ?? [];

  console.log(messagesQuery.data);

  const isPending = createMutation.isPending;
  const isLoading = messagesQuery.isLoading;

  const onSubmit = (json: FormValues) => {
    if (!nodeId) return;

    createMutation.mutate(
      { json: { ...json, nodeId } },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Interactive Word</SheetTitle>
          <SheetDescription>Create a new interactive word</SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-4 text-muted-foreground animate-spin" />
          </div>
        ) : (
          <InteractiveWordForm
            onSubmit={onSubmit}
            disabled={isPending}
            defaultValues={{
              word: "",
              filter: "",
              messageId: "",
            }}
            messageOptions={messageOptions}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};
