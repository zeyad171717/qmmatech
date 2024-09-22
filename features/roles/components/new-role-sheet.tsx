import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { z } from "zod";
import { useNewRole } from "../hooks/use-new-role";
import { useCreateRole } from "../api/use-create-role";
import { RoleForm } from "./role-form";

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export const NewRoleSheet = () => {
  const { isOpen, onClose } = useNewRole();

  const mutation = useCreateRole();

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Role</SheetTitle>
          <SheetDescription>Create a new role</SheetDescription>
        </SheetHeader>
        <RoleForm
          onSubmit={onSubmit}
          disabled={mutation.isPending}
          defaultValues={{
            name: "",
            description: "",
          }}
        />
      </SheetContent>
    </Sheet>
  );
};
