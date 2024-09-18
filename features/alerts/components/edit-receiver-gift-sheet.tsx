import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useOpenReceiverGift } from "../hooks/use-open-receiver-gift";
import { useCreateReceiverGift } from "../api/use-create-receiver-gift";
import { useGetAlerts } from "../api/use-get-alerts";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { useGetErrorMessages } from "@/features/error-messages/api/use-get-error-messages";
import { ReceiverGiftForm } from "./receiver-gift-form";

import { useGetReceiverGift } from "../api/use-get-receiver-gift";
import { useEditReceiverGift } from "../api/use-edit-receiver-gift";
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

export const EditReceiverGiftSheet = () => {
  const { isOpen, onClose, id } = useOpenReceiverGift();

  const receiverGiftQuery = useGetReceiverGift(id);
  const editMutation = useEditReceiverGift(id);

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

  const defaultValues = receiverGiftQuery.data
    ? {
        time: receiverGiftQuery.data.time,
        scheduledDays: receiverGiftQuery.data.scheduledDays,
        scheduledHours: receiverGiftQuery.data.scheduledHours,
        scheduledMinutes: receiverGiftQuery.data.scheduledMinutes,
        alertId: receiverGiftQuery.data.alertId,
        messageAfterFirstButtonId:
          receiverGiftQuery.data.messageAfterFirstButtonId,
        messageAfterSecondButtonId:
          receiverGiftQuery.data.messageAfterSecondButtonId,
        errorMessageId: receiverGiftQuery.data.errorMessageId,
        statusErrorMessageId: receiverGiftQuery.data.statusErrorMessageId,
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
          <SheetTitle>Edit Receiver Gift</SheetTitle>
          <SheetDescription>Edit an existing receiver gift</SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-4 textMuted-foreground animate-spin" />
          </div>
        ) : (
          <ReceiverGiftForm
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
