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
import { useGetTemplates } from "@/features/templates/api/use-get-templates";
import { useOpenAbandantCart } from "../hooks/use-open-abandant-cart";
import { useGetAbandantCart } from "../api/use-get-abandant-cart";
import { useEditAbandantCart } from "../api/use-edit-abandant-cart";
import { AbandantCartForm } from "./abandant-cart-form";

const formSchema = z.object({
  name: z.string(),
  statusCode: z.string(),
  templateId: z.string(),
  time: z.string(),
  scheduledDays: z.number(),
  scheduledHours: z.number(),
  scheduledMinutes: z.number(),
  minCartValue: z.number(),
  maxCartValue: z.number(),
  city: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export const EditAbandantCartSheet = () => {
  const { isOpen, onClose, id } = useOpenAbandantCart();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this abandant cart."
  );

  const abandantCartQuery = useGetAbandantCart(id);
  const editMutation = useEditAbandantCart(id);

  const templatesQuery = useGetTemplates();
  const templateOptions =
    templatesQuery.data?.map((template) => ({
      label: template.name,
      value: template.id,
    })) ?? [];

  const isPending = editMutation.isPending;
  const isLoading = abandantCartQuery.isLoading || templatesQuery.isLoading;

  const onSubmit = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const defaultValues = abandantCartQuery.data
    ? {
        name: abandantCartQuery.data.name,
        statusCode: abandantCartQuery.data.statusCode,
        templateId: abandantCartQuery.data.templateId,
        time: abandantCartQuery.data.time,
        scheduledDays: abandantCartQuery.data.scheduledDays,
        scheduledHours: abandantCartQuery.data.scheduledHours,
        scheduledMinutes: abandantCartQuery.data.scheduledMinutes,
        minCartValue: abandantCartQuery.data.minCartValue,
        maxCartValue: abandantCartQuery.data.maxCartValue,
        city: abandantCartQuery.data.city,
      }
    : {
        name: "",
        statusCode: "",
        templateId: "",
        time: "Immediate",
        scheduledDays: 0,
        scheduledHours: 0,
        scheduledMinutes: 0,
        minCartValue: 0,
        maxCartValue: 0,
        city: "",
      };

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Abandant cart</SheetTitle>
            <SheetDescription>Edit an existing abandant cart</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 textMuted-foreground animate-spin" />
            </div>
          ) : (
            <AbandantCartForm
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
