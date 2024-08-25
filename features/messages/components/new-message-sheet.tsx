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
import { useGetMessageHeaderTypes } from "../api/use-get-message-header-types";
import { useGetMessageButtonTypes } from "../api/use-get-message-button-types";

const formSchema = z.object({
  name: z.string(),
  headerId: z.string().nullable(),
  bodyMessage: z.string(),
  bodyEnding: z.string().nullable(),
  footerId: z.string().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

export const NewMessageSheet = () => {
  const { isOpen, onClose } = useNewMessage();

  const createMutation = useCreateMessage();

  const headerQuery = useGetMessageHeaderTypes();
  const headerOptions = headerQuery.data ?? [];

  const buttonsQuery = useGetMessageButtonTypes();
  const buttonOptions = buttonsQuery.data ?? [];

  const isPending = createMutation.isPending;

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
        <MessageForm
          onSubmit={onSubmit}
          disabled={isPending}
          defaultValues={{
            name: "",
            bodyMessage: "",
            bodyEnding: "",
            buttonsAvailable: false,
            header: false,
            footer: false,
          }}
          headerOptions={headerOptions}
          buttonOptions={buttonOptions}
        />
      </SheetContent>
    </Sheet>
  );
};
