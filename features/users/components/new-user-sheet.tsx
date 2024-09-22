import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { z } from "zod";
import { UserForm } from "./user-form";
import { useCreateUser } from "../api/use-create-user";
import { useNewUser } from "../hooks/use-new-user";
import { useGetRoles } from "@/features/roles/api/use-get-roles";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  roleId: z.string().min(1),
  username: z.string().min(1),
  language: z.string().min(1),
  email: z.string().min(1),
  password: z.string().min(1),
  phoneNumber: z.string().min(11),
});

type FormValues = z.infer<typeof formSchema>;

export const NewUserSheet = () => {
  const { isOpen, onClose } = useNewUser();

  const mutation = useCreateUser();

  const roleQuery = useGetRoles();
  const roleOptions = roleQuery.data?.map((role) => ({
    label: role.name,
    value: role.id,
  }));

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const isLoading = roleQuery.isLoading;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New User</SheetTitle>
          <SheetDescription>Create a new user</SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-4 text-muted-foreground animate-spin" />
          </div>
        ) : (
          <UserForm
            onSubmit={onSubmit}
            disabled={mutation.isPending}
            defaultValues={{
              roleId: "",
              username: "",
              language: "",
              email: "",
              password: "",
              phoneNumber: "",
            }}
            roleOptions={roleOptions}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};
