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
import { PayOnReceiveForm } from "./pay-on-receive-form";
import { useOpenPayOnReceive } from "../hooks/use-open-pay-on-receive";
import { useGetPayOnReceive } from "../api/use-get-pay-on-receive";
import { useEditPayOnReceive } from "../api/use-edit-pay-on-receive";

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
  confirmationStatus: z.string(),
  cancellationStatus: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export const EditPayOnReceiveSheet = () => {
  const { isOpen, onClose, id } = useOpenPayOnReceive();

  const payOnReceiveQuery = useGetPayOnReceive(id);
  const editMutation = useEditPayOnReceive(id);

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
    payOnReceiveQuery.isLoading ||
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

  const defaultValues = payOnReceiveQuery.data
    ? {
        time: payOnReceiveQuery.data.time,
        scheduledDays: payOnReceiveQuery.data.scheduledDays,
        scheduledHours: payOnReceiveQuery.data.scheduledHours,
        scheduledMinutes: payOnReceiveQuery.data.scheduledMinutes,
        alertId: payOnReceiveQuery.data.alertId,
        messageAfterFirstButtonId: payOnReceiveQuery.data.messageAfterFirstButtonId,
        messageAfterSecondButtonId: payOnReceiveQuery.data.messageAfterSecondButtonId,
        errorMessageId: payOnReceiveQuery.data.errorMessageId,
        statusErrorMessageId: payOnReceiveQuery.data.statusErrorMessageId,
        confirmationStatus: payOnReceiveQuery.data.confirmationStatus,
        cancellationStatus: payOnReceiveQuery.data.cancellationStatus,
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
        confirmationStatus: "",
        cancellationStatus: "",
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
          <PayOnReceiveForm
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
