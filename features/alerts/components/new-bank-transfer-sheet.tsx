import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useGetAlerts } from "../api/use-get-alerts";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { useGetErrorMessages } from "@/features/error-messages/api/use-get-error-messages";
import { useNewBankTransfer } from "../hooks/use-new-bank-transfer";
import { useCreateBankTransfer } from "../api/use-create-bank-transfer";
import { BankTransferForm } from "./bank-transfer-form";

const formSchema = z.object({
  time: z.string(),
  scheduledDays: z.number(),
  scheduledHours: z.number(),
  scheduledMinutes: z.number(),
  alertId: z.string(),
  messageAfterFirstButtonId: z.string(),
  messageAfterSecondButtonId: z.string(),
  errorMessageId: z.string(),
  statusErrorMessageId: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export const NewBankTransferSheet = () => {
  const { isOpen, onClose } = useNewBankTransfer();

  const createMutation = useCreateBankTransfer();

  const alertQuery = useGetAlerts();
  const alertOptions =
    alertQuery.data?.map((alert) => ({
      label: alert.name,
      value: alert.id,
    })) ?? [];

  const messageQuery = useGetMessages();
  const messageOptions =
    messageQuery.data?.map((message) => ({
      label: message.name,
      value: message.id,
    })) ?? [];

  const errorMessageQuery = useGetErrorMessages();
  const errorMessageOptions =
    errorMessageQuery.data?.map((errorMessage) => ({
      label: errorMessage.name,
      value: errorMessage.id,
    })) ?? [];

  const isPending = createMutation.isPending;
  const isLoading =
    alertQuery.isLoading ||
    messageQuery.isLoading ||
    errorMessageQuery.isLoading;

  const onSubmit = (json: FormValues) => {
    createMutation.mutate(
      { json: { ...json } },
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
          <SheetTitle>New Bank transfer</SheetTitle>
          <SheetDescription>Create a new bank transfer</SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-4 textMuted-foreground animate-spin" />
          </div>
        ) : (
          <BankTransferForm
            onSubmit={onSubmit}
            disabled={isPending}
            defaultValues={{
              time: "Immediate",
              scheduledDays: 0,
              scheduledHours: 0,
              scheduledMinutes: 0,
              alertId: "",
              messageAfterFirstButtonId: "",
              messageAfterSecondButtonId: "",
              errorMessageId: "",
              statusErrorMessageId: "",
            }}
            alertOptions={alertOptions}
            messageOptions={messageOptions}
            errorMessageOptions={errorMessageOptions}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};
