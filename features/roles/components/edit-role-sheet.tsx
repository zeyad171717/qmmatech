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
import { useOpenRole } from "../hooks/use-open-role";
import { useGetRole } from "../api/use-get-role";
import { useEditRole } from "../api/use-edit-role";
import { useDeleteRole } from "../api/use-delete-role";
import { RoleForm } from "./role-form";

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export const EditRoleSheet = () => {
  const { isOpen, onClose, id } = useOpenRole();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this role."
  );

  const roleQuery = useGetRole(id);
  const editMutation = useEditRole(id);
  const deleteMutation = useDeleteRole(id);

  const isPending = editMutation.isPending || deleteMutation.isPending;

  const isLoading = roleQuery.isLoading;

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

  const defaultValues = roleQuery.data
    ? {
        name: roleQuery.data.name,
        description: roleQuery.data.description,
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
            <SheetTitle>Edit Role</SheetTitle>
            <SheetDescription>Edit an existing role</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <RoleForm
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
