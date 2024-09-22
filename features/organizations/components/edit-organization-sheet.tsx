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
import { OrganizationForm } from "./organization-form";
import { useDeleteOrganization } from "../api/use-delete-organization";
import { useEditOrganization } from "../api/use-edit-organization";
import { useGetOrganization } from "../api/use-get-organization";
import { useOpenOrganization } from "../hooks/use-open-organization";

const formSchema = z.object({
  name: z.string().min(1),
  country: z.string().min(1),
  city: z.string().min(1),
  phone: z.string().min(11),
});

type FormValues = z.infer<typeof formSchema>;

export const EditOrganizationSheet = () => {
  const { isOpen, onClose, id } = useOpenOrganization();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this organization."
  );

  const organizationQuery = useGetOrganization(id);
  const editMutation = useEditOrganization(id);
  const deleteMutation = useDeleteOrganization(id);

  const isPending = editMutation.isPending || deleteMutation.isPending;

  const isLoading = organizationQuery.isLoading;

  const onSubmit = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const onDelete = async () => {
    const ok = await confirm();

    if (ok) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const defaultValues = organizationQuery.data
    ? {
        name: organizationQuery.data.name,
        country: organizationQuery.data.country,
        city: organizationQuery.data.city,
        phone: organizationQuery.data.phone,
      }
    : {
        name: "",
        country: "",
        city: "",
        phone: "",
      };

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Organization</SheetTitle>
            <SheetDescription>Edit an existing organization</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <OrganizationForm
              id={id}
              onSubmit={onSubmit}
              disabled={isPending}
              defaultValues={defaultValues}
              onDelete={onDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
