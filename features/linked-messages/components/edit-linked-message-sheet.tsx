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
import { LinkedMessageForm } from "./linked-message-form";
import { useOpenLinkedMessage } from "../hooks/use-open-linked-message";
import { useGetLinkedMessage } from "../api/use-get-linked-message";
import { useEditLinkedMessage } from "../api/use-edit-linked-message";
import { useDeleteLinkedMessage } from "../api/use-delete-linked-message";
import { useGetMessageHeaderTypes } from "@/features/messages/api/use-get-message-header-types";
import { useGetMessageButtonTypes } from "@/features/messages/api/use-get-message-button-types";

const formSchema = z.object({
  name: z.string(),
  bodyMessage: z.string(),
  bodyEnding: z.string().optional(),
  header: z.boolean().default(false),
  headerTypeId: z.string().optional(),
  headerText: z.string().optional(),
  footer: z.boolean().default(false),
  footerText: z.string().optional(),
  buttonsAvailable: z.boolean().default(false),
  position: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export const EditLinkedMessageSheet = () => {
  const { isOpen, onClose, id } = useOpenLinkedMessage();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this linkedMessage."
  );

  const linkedMessageQuery = useGetLinkedMessage(id);
  const editMutation = useEditLinkedMessage(id);
  const deleteMutation = useDeleteLinkedMessage(id);

  const headerQuery = useGetMessageHeaderTypes();
  const headerOptions = headerQuery.data ?? [];

  const buttonsQuery = useGetMessageButtonTypes();
  const buttonOptions = buttonsQuery.data ?? [];

  const isPending = editMutation.isPending || deleteMutation.isPending;
  const isLoading = linkedMessageQuery.isLoading;

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

  const defaultValues = linkedMessageQuery.data
    ? {
        name: linkedMessageQuery.data.name,
        bodyMessage: linkedMessageQuery.data.bodyMessage,
        bodyEnding: linkedMessageQuery.data.bodyEnding,
        header: linkedMessageQuery.data.header,
        headerType: linkedMessageQuery.data.headerType,
        headerText: linkedMessageQuery.data.headerText,
        footer: linkedMessageQuery.data.footer,
        footerText: linkedMessageQuery.data.footerText,
        buttonsAvailable: false,
        position: linkedMessageQuery.data.position,
      }
    : {
        name: "",
        bodyMessage: "",
        bodyEnding: "",
        header: false,
        headerType: "",
        headerText: "",
        footer: false,
        footerText: "",
        buttonsAvailable: false,
        position: "",
      };
      

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Message</SheetTitle>
            <SheetDescription>Edit an existing Message</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 textMuted-foreground animate-spin" />
            </div>
          ) : (
            <LinkedMessageForm
              onSubmit={onSubmit}
              disabled={isPending}
              defaultValues={defaultValues}
              headerOptions={headerOptions}
              buttonOptions={buttonOptions}
              id={id}
              onDelete={onDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
