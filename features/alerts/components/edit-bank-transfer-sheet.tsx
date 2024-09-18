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
import { useOpenBankTransfer } from "../hooks/use-open-bank-transfer";
import { useGetBankTransfer } from "../api/use-get-bank-transfer";
import { useEditBankTransfer } from "../api/use-edit-bank-transfer";
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

export const EditBankTransferSheet = () => {
  const { isOpen, onClose, id } = useOpenBankTransfer();

  const bankTransferQuery = useGetBankTransfer(id);
  const editMutation = useEditBankTransfer(id);

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

  const isPending = editMutation.isPending;
  const isLoading =
  bankTransferQuery.isLoading ||
    alertQuery.isLoading ||
    messageQuery.isLoading ||
    errorMessageQuery.isLoading;

  const onSubmit = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const defaultValues = bankTransferQuery.data
    ? {
        time: bankTransferQuery.data.time,
        scheduledDays: bankTransferQuery.data.scheduledDays,
        scheduledHours: bankTransferQuery.data.scheduledHours,
        scheduledMinutes: bankTransferQuery.data.scheduledMinutes,
        alertId: bankTransferQuery.data.alertId,
        messageAfterFirstButtonId:
          bankTransferQuery.data.messageAfterFirstButtonId,
        messageAfterSecondButtonId:
          bankTransferQuery.data.messageAfterSecondButtonId,
        errorMessageId: bankTransferQuery.data.errorMessageId,
        statusErrorMessageId: bankTransferQuery.data.statusErrorMessageId,
      }
    : {
        time: "Immediate",
        scheduledDays: 0,
        scheduledHours: 0,
        scheduledMinutes: 0,
        alertId: "",
        messageAfterFirstButtonId: "",
        messageAfterSecondButtonId: "",
        errorMessageId: "",
        statusErrorMessageId: "",
      };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>Edit Alert</SheetTitle>
          <SheetDescription>Edit an existing alert</SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-4 textMuted-foreground animate-spin" />
          </div>
        ) : (
          <BankTransferForm
            onSubmit={onSubmit}
            disabled={isPending}
            alertOptions={alertOptions}
            messageOptions={messageOptions}
            errorMessageOptions={errorMessageOptions}
            defaultValues={defaultValues}
            id={id}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};
