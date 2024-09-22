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
import { UserForm } from "./user-form";
import { useDeleteUser } from "../api/use-delete-user";
import { useEditUser } from "../api/use-edit-user";
import { useGetUser } from "../api/use-get-user";
import { useOpenUser } from "../hooks/use-open-user";
import { useGetRoles } from "@/features/roles/api/use-get-roles";

const formSchema = z.object({
  roleId: z.string().min(1),
  username: z.string().min(1),
  language: z.string().min(1),
  email: z.string().min(1),
  password: z.string().min(1),
  phoneNumber: z.string().min(11),
});

type FormValues = z.infer<typeof formSchema>;

export const EditUserSheet = () => {
  const { isOpen, onClose, id } = useOpenUser();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this user."
  );

  const userQuery = useGetUser(id);
  const editMutation = useEditUser(id);
  const deleteMutation = useDeleteUser(id);

  const roleQuery = useGetRoles();
  const roleOptions = roleQuery.data?.map((role) => ({
    label: role.name,
    value: role.id,
  }));

  const isPending = editMutation.isPending || deleteMutation.isPending;
  const isLoading = userQuery.isLoading || roleQuery.isLoading;

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

  const defaultValues = userQuery.data
    ? {
        roleId: userQuery.data.roleId,
        username: userQuery.data.username,
        language: userQuery.data.language,
        email: userQuery.data.email,
        password: userQuery.data.password,
        phoneNumber: userQuery.data.phoneNumber,
      }
    : {
        roleId: "",
        username: "",
        language: "",
        email: "",
        password: "",
        phoneNumber: "",
      };

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit User</SheetTitle>
            <SheetDescription>Edit an existing user</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <UserForm
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
