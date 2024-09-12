import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useConfirm } from "@/hooks/use-confirm";
import { useOpenInteractiveWord } from "../hooks/use-open-interactive-word";
import { useGetInteractiveWord } from "../api/use-get-interactive-word";
import { useEditInteractiveWord } from "../api/use-edit-interactive-word";
import { useDeleteInteractiveWord } from "../api/use-delete-interactive-word";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { InteractiveWordForm } from "./interactive-word-form";

const formSchema = z.object({
  word: z.string(),
  filter: z.string(),
  messageId: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export const EditInteractiveWordSheet = () => {
  const { isOpen, onClose, id } = useOpenInteractiveWord();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this interactive word."
  );

  const interactiveWordQuery = useGetInteractiveWord(id);
  const editMutation = useEditInteractiveWord(id);
  const deleteMutation = useDeleteInteractiveWord(id);

  const messagesQuery = useGetMessages();
  const messageOptions =
    messagesQuery.data?.map((message) => ({
      label: message.name,
      value: message.id,
    })) ?? [];

  const isPending = editMutation.isPending || deleteMutation.isPending;
  const isLoading = messagesQuery.isLoading || interactiveWordQuery.isLoading;

  const onSubmit = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const onDelete = async () => {
    const ok = await confirm();

    if (ok) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const defaultValues = interactiveWordQuery.data
    ? {
        word: interactiveWordQuery.data.word,
        filter: interactiveWordQuery.data.filter,
        messageId: interactiveWordQuery.data.messageId,
      }
    : {
        word: "",
        filter: "",
        messageId: "",
      };

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Interactive Word</SheetTitle>
            <SheetDescription>
              Edit an existing interactive word
            </SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 textMuted-foreground animate-spin" />
            </div>
          ) : (
            <InteractiveWordForm
              onSubmit={onSubmit}
              disabled={isPending}
              defaultValues={defaultValues}
              messageOptions={messageOptions}
              id={id}
              onDelete={onDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
