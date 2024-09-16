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
import { useNewAlert } from "../hooks/use-new-alert";
import { useCreateAlert } from "../api/use-create-alert";
import { useGetTemplates } from "@/features/templates/api/use-get-templates";

const formSchema = z.object({
  name: z.string(),
  statusCode: z.string(),
  to: z.enum(["Customer", "Receiver"]),
  templateId: z.string(),
  time: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export const NewAlertSheet = () => {
  const { isOpen, onClose } = useNewAlert();

  const createMutation = useCreateAlert();

  const templatesQuery = useGetTemplates();
  const templateOptions =
    templatesQuery.data?.map((template) => ({
      label: template.name,
      value: template.id,
    })) ?? [];

  const isPending = createMutation.isPending;
  const isLoading = templatesQuery.isLoading;

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
              name: "",
              statusCode: "",
              to: "Customer",
              templateId: "",
              time: "Immediate",
            }}
            templateOptions={templateOptions}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};
