import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { z } from "zod";
import { OrganizationForm } from "./organization-form";
import { useCreateOrganization } from "../api/use-create-organization";
import { useNewOrganization } from "../hooks/use-new-organization";

const formSchema = z.object({
  name: z.string().min(1),
  country: z.string().min(1),
  city: z.string().min(1),
  phone: z.string().min(11),
});

type FormValues = z.infer<typeof formSchema>;

export const NewOrganizationSheet = () => {
  const { isOpen, onClose } = useNewOrganization();

  const mutation = useCreateOrganization();

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
          <SheetTitle>New Organization</SheetTitle>
          <SheetDescription>Create a new organization</SheetDescription>
        </SheetHeader>
        <OrganizationForm
          onSubmit={onSubmit}
          disabled={mutation.isPending}
          defaultValues={{
            name: "",
            country: "",
            city: "",
            phone: "",
          }}
        />
      </SheetContent>
    </Sheet>
  );
};
