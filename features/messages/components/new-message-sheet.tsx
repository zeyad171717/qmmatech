import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { z } from "zod";
import { MessageForm } from "./message-form";
import { Loader2 } from "lucide-react";
import { useNewMessage } from "../hooks/use-new-message";
import { useCreateMessage } from "../api/use-create-message";
import { useGetMessageCategories } from "../api/use-get-message-categories";
import { useGetMessageTypes } from "../api/use-get-message-types";
import { useGetMessageLanguages } from "../api/use-get-message-languages";
import { useGetMessageHeaderTypes } from "../api/use-get-message-header-types";
import { useGetMessageButtonTypes } from "../api/use-get-message-button-types";

const formSchema = z.object({
  name: z.string(),
  allowCategoryChange: z.boolean(),
  categoryId: z.string(),
  typeId: z.string(),
  languageId: z.string(),
  headerId: z.string().nullable(),
  bodyMessage: z.string(),
  footerId: z.string().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

export const NewMessageSheet = () => {
  const { isOpen, onClose } = useNewMessage();

  const createMutation = useCreateMessage();

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

  const isPending = createMutation.isPending;
  const isLoading =
    categoryQuery.isLoading || typeQuery.isLoading || languageQuery.isLoading;

  const onSubmit = (json: FormValues) => {
    createMutation.mutate(
      { json },
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
          <SheetTitle>New Message</SheetTitle>
          <SheetDescription>Create a new message</SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-4 text-muted-foreground animate-spin" />
          </div>
        ) : (
          <MessageForm
            onSubmit={onSubmit}
            disabled={isPending}
            defaultValues={{
              name: "",
              allowCategoryChange: false,
              categoryId: "",
              languageId: "",
              typeId: "",
              bodyMessage: "",
              buttonsAvailable: false,
              header: false,
              footer: false,
            }}
            categoryOptions={categoryOptions}
            typeOptions={typeOptions}
            languageOptions={languageOptions}
            headerOptions={headerOptions}
            buttonOptions={buttonOptions}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};
