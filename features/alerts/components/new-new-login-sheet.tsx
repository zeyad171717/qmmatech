import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { z } from "zod";
import { AlertForm } from "./alert-form";
import { Loader2 } from "lucide-react";
import { useGetTemplates } from "@/features/templates/api/use-get-templates";
import { useNewNewLogin } from "@/features/alerts/hooks/use-new-new-login";
import { useCreateNewLogin } from "@/features/alerts/api/use-create-new-login";
import { useGetAlerts } from "@/features/alerts/api/use-get-alerts";

const formSchema = z.object({
  status: z.string(),
  templateId: z.string(),
  alertId: z.string(),
  time: z.string(),
  scheduledDays: z.number(),
  scheduledHours: z.number(),
  scheduledMinutes: z.number(),
});

type FormValues = z.infer<typeof formSchema>;

export const NewNewLoginSheet = () => {
  const { isOpen, onClose } = useNewNewLogin();

  const createMutation = useCreateNewLogin();

  const templatesQuery = useGetTemplates();
  const templateOptions =
    templatesQuery.data?.map((template) => ({
      label: template.name,
      value: template.id,
    })) ?? [];

  const alertsQuery = useGetAlerts();
  const alertOptions =
    alertsQuery.data?.map((alert) => ({
      label: alert.name,
      value: alert.id,
    })) ?? [];

  const isPending = createMutation.isPending;
  const isLoading = templatesQuery.isLoading || alertsQuery.isLoading;

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
          <SheetTitle>New Alert</SheetTitle>
          <SheetDescription>Create a new alert</SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-4 textMuted-foreground animate-spin" />
          </div>
        ) : (
          <AlertForm
            onSubmit={onSubmit}
            disabled={isPending}
            defaultValues={{
              status: "",
              templateId: "",
              alertId: "",
              time: "Immediate",
              scheduledDays: 0,
              scheduledHours: 0,
              scheduledMinutes: 0,
            }}
            templateOptions={templateOptions}
            alertOptions={alertOptions}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};
