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
import { useOpenAlert } from "../hooks/use-open-alert";
import { useGetAlert } from "../api/use-get-alert";
import { useEditAlert } from "../api/use-edit-alert";
import { useGetTemplates } from "@/features/templates/api/use-get-templates";
import { AlertForm } from "./alert-form";

const formSchema = z.object({
  name: z.string(),
  statusCode: z.string(),
  to: z.enum(["Customer", "Receiver"]),
  templateId: z.string(),
  time: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export const EditAlertSheet = () => {
  const { isOpen, onClose, id } = useOpenAlert();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this alert."
  );

  const alertQuery = useGetAlert(id);
  const editMutation = useEditAlert(id);

  const templatesQuery = useGetTemplates();
  const templateOptions =
    templatesQuery.data?.map((template) => ({
      label: template.name,
      value: template.id,
    })) ?? [];

  const isPending = editMutation.isPending;
  const isLoading = alertQuery.isLoading || templatesQuery.isLoading;

  const onSubmit = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const defaultValues = alertQuery.data
    ? {
        name: alertQuery.data.name,
        statusCode: alertQuery.data.statusCode,
        to: alertQuery.data.to,
        templateId: alertQuery.data.templateId,
        time: alertQuery.data.time,
      }
    : {
        name: "",
        statusCode: "",
        to: "Customer",
        templateId: "",
        time: "Immediate",
      };

  return (
    <>
      <ConfirmDialog />
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
            <AlertForm
              onSubmit={onSubmit}
              disabled={isPending}
              templateOptions={templateOptions}
              defaultValues={defaultValues}
              id={id}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
