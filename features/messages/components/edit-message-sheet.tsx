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
import { MessageForm } from "./message-form";
import { useGetMessageCategories } from "../api/use-get-message-categories";
import { useGetMessageTypes } from "../api/use-get-message-types";
import { useGetMessageLanguages } from "../api/use-get-message-languages";
import { useGetMessageHeaderTypes } from "../api/use-get-message-header-types";
import { useGetMessageButtonTypes } from "../api/use-get-message-button-types";
import { useOpenMessage } from "../hooks/use-open-message";
import { useGetMessage } from "../api/use-get-message";
import { useEditMessage } from "../api/use-edit-message";
import { useDeleteMessage } from "../api/use-delete-message";

const formSchema = z.object({
  name: z.string(),
  allowCategoryChange: z.boolean(),
  categoryId: z.string(),
  typeId: z.string(),
  languageId: z.string(),
  bodyMessage: z.string(),
  header: z.boolean().default(false),
  headerTypeId: z.string().optional(),
  headerText: z.string().optional(),
  footer: z.boolean().default(false),
  footerText: z.string().optional(),
  buttonsAvailable: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export const EditMessageSheet = () => {
  const { isOpen, onClose, id } = useOpenMessage();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this message."
  );

  const messageQuery = useGetMessage(id);
  const editMutation = useEditMessage(id);
  const deleteMutation = useDeleteMessage(id);

  const categoryQuery = useGetMessageCategories();
  const categoryOptions = categoryQuery.data ?? [];

  const typeQuery = useGetMessageTypes();
  const typeOptions = typeQuery.data ?? [];

  const languageQuery = useGetMessageLanguages();
  const languageOptions = languageQuery.data ?? [];

  const headerQuery = useGetMessageHeaderTypes();
  const headerOptions = headerQuery.data ?? [];

  const buttonsQuery = useGetMessageButtonTypes();
  const buttonOptions = buttonsQuery.data ?? [];

  const isPending = editMutation.isPending || deleteMutation.isPending;
  const isLoading =
    categoryQuery.isLoading ||
    typeQuery.isLoading ||
    languageQuery.isLoading ||
    messageQuery.isLoading;

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

  const defaultValues = messageQuery.data
    ? {
        name: messageQuery.data.name,
        allowCategoryChange: messageQuery.data.allowCategoryChange,
        categoryId: messageQuery.data.categoryId,
        languageId: messageQuery.data.languageId,
        typeId: messageQuery.data.typeId,
        bodyMessage: messageQuery.data.bodyMessage,
        headerId: messageQuery.data.headerId,
        footerId: messageQuery.data.footerId,
      }
    : {
        name: "",
        allowCategoryChange: false,
        categoryId: "",
        languageId: "",
        typeId: "",
        bodyMessage: "",
        headerId: "",
        footerId: "",
      };

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Message</SheetTitle>
            <SheetDescription>Edit an existing message</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <MessageForm
              onSubmit={onSubmit}
              disabled={isPending}
              defaultValues={defaultValues}
              categoryOptions={categoryOptions}
              typeOptions={typeOptions}
              languageOptions={languageOptions}
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
