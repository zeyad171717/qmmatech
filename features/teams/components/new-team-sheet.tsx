import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { z } from "zod";
import { TeamForm } from "./team-form";
import { useCreateTeam } from "../api/use-create-team";
import { useNewTeam } from "../hooks/use-new-team";

const formSchema = z.object({
  name: z.string().min(1),
});

type FormValues = z.infer<typeof formSchema>;

export const NewTeamSheet = () => {
  const { isOpen, onClose } = useNewTeam();

  const mutation = useCreateTeam();

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
          <SheetTitle>New Team</SheetTitle>
          <SheetDescription>Create a new team</SheetDescription>
        </SheetHeader>
        <TeamForm
          onSubmit={onSubmit}
          disabled={mutation.isPending}
          defaultValues={{
            name: "",
          }}
        />
      </SheetContent>
    </Sheet>
  );
};
