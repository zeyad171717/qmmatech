import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useOpenNewLogin } from "../hooks/use-open-new-login";
import { useGetNewLogin } from "../api/use-get-new-login";
import { useEditNewLogin } from "../api/use-edit-new-login";
import { useGetTemplates } from "@/features/templates/api/use-get-templates";
import { useGetAlerts } from "@/features/templates/api/use-get-templates";
import { NewLoginForm } from "./new-login-form";

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

export const EditNewLoginSheet = () => {
  const { isOpen, onClose, id } = useOpenNewLogin();

  const newLoginQuery = useGetNewLogin(id);
  const editMutation = useEditNewLogin(id);

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

  const isPending = editMutation.isPending;
  const isLoading =
    alertQuery.isLoading || templatesQuery.isLoading || alertsQuery.isLoading;

  const onSubmit = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const defaultValues = newLoginQuery.data
    ? {
        alertId: alertQuery.data.alertId,
        status: newLoginQuery.data.status,
        templateId: newLoginQuery.data.templateId,
        time: newLoginQuery.data.time,
        scheduledDays: newLoginQuery.data.scheduledDays,
        scheduledHours: newLoginQuery.data.scheduledHours,
        scheduledMinutes: newLoginQuery.data.scheduledMinutes,
      }
    : {
        alertId: "",
        status: "",
        templateId: "",
        time: "Immediate",
        scheduledDays: 0,
        scheduledHours: 0,
        scheduledMinutes: 0,
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
            <NewLoginForm
              onSubmit={onSubmit}
              disabled={isPending}
              templateOptions={templateOptions}
              alertOptions={alertOptions}
              defaultValues={defaultValues}
              id={id}
            />
          )}
        </SheetContent>
      </Sheet>
  );
};
