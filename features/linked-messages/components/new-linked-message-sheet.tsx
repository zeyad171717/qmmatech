import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { z } from "zod";
import { LinkedMessageForm } from "./linked-message-form";
import { Loader2 } from "lucide-react";
import { useNewLinkedMessage } from "../hooks/use-new-linked-message";
import { useCreateLinkedMessage } from "../api/use-create-linked-message";
import { useGetMessageHeaderTypes } from "@/features/messages/api/use-get-message-header-types";
import { useGetMessageButtonTypes } from "@/features/messages/api/use-get-message-button-types";

const formSchema = z.object({
  name: z.string(),
  bodyMessage: z.string(),
  bodyEnding: z.string().optional(),
  header: z.boolean().default(false),
  headerType: z.string().optional(),
  headerText: z.string().optional(),
  footer: z.boolean().default(false),
  footerText: z.string().optional(),
  buttonsAvailable: z.boolean().default(false),
  position: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export const NewLinkedMessageSheet = () => {
  const { isOpen, onClose, nodeId } = useNewLinkedMessage();

  const createMutation = useCreateLinkedMessage();

  const headerQuery = useGetMessageHeaderTypes();
  const headerOptions = headerQuery.data ?? [];

  const buttonsQuery = useGetMessageButtonTypes();
  const buttonOptions = buttonsQuery.data ?? [];

  const isPending = createMutation.isPending;

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
          <SheetTitle>New Message</SheetTitle>
          <SheetDescription>Create a new message</SheetDescription>
        </SheetHeader>
        <LinkedMessageForm
          onSubmit={onSubmit}
          disabled={isPending}
          defaultValues={{
            name: "",
            bodyMessage: "",
            bodyEnding: "",
            header: false,
            headerType: "",
            headerText: "",
            footer: false,
            footerText: "",
            buttonsAvailable: false,
            position: ""
          }}
          headerOptions={headerOptions}
          buttonOptions={buttonOptions}
        />
      </SheetContent>
    </Sheet>
  );
};
