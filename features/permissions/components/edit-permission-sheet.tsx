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
import { PermissionForm } from "./permission-form";
import { useOpenPermission } from "../hooks/use-open-permission";
import { useGetPermission } from "../api/use-get-permission";
import { useEditPermission } from "../api/use-edit-permission";
import { useDeletePermission } from "../api/use-delete-permission";

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
});

type FormValues = z.infer<typeof formSchema>;

export const EditPermissionSheet = () => {
  const { isOpen, onClose, id } = useOpenPermission();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this permission."
  );

  const permissionQuery = useGetPermission(id);
  const editMutation = useEditPermission(id);
  const deleteMutation = useDeletePermission(id);

  const isPending = editMutation.isPending || deleteMutation.isPending;

  const isLoading = permissionQuery.isLoading;

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

  const defaultValues = permissionQuery.data
    ? {
        name: permissionQuery.data.name,
        description: permissionQuery.data.description,
      }
    : {
        name: "",
        description: "",
      };

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Permission</SheetTitle>
            <SheetDescription>Edit an existing permission</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <PermissionForm
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
