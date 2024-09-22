import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { z } from "zod";
import { useNewPermission } from "../hooks/use-new-permission";
import { useCreatePermission } from "../api/use-create-permission";
import { PermissionForm } from "./permission-form";

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export const NewPermissionSheet = () => {
  const { isOpen, onClose } = useNewPermission();

  const mutation = useCreatePermission();

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
          <SheetTitle>New Permission</SheetTitle>
          <SheetDescription>Create a new permission</SheetDescription>
        </SheetHeader>
        <PermissionForm
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
