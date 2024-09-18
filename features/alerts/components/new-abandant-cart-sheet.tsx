import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useGetTemplates } from "@/features/templates/api/use-get-templates";
import { useNewAbandantCart } from "../hooks/use-new-abandant-cart";
import { useCreateAbandantCart } from "../api/use-create-abandant-cart";
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

export const NewAbandantCartSheet = () => {
  const { isOpen, onClose } = useNewAbandantCart();

  const createMutation = useCreateAbandantCart();

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
          <SheetTitle>New Abandant Cart</SheetTitle>
          <SheetDescription>Create a new abandant cart</SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-4 textMuted-foreground animate-spin" />
          </div>
        ) : (
          <AbandantCartForm
            onSubmit={onSubmit}
            disabled={isPending}
            defaultValues={{
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
            }}
            templateOptions={templateOptions}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};
