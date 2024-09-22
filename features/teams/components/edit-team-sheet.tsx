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
import { TeamForm } from "./team-form";
import { useDeleteTeam } from "../api/use-delete-team";
import { useEditTeam } from "../api/use-edit-team";
import { useGetTeam } from "../api/use-get-team";
import { useOpenTeam } from "../hooks/use-open-team";

const formSchema = z.object({
  name: z.string().min(1),
});

type FormValues = z.infer<typeof formSchema>;

export const EditTeamSheet = () => {
  const { isOpen, onClose, id } = useOpenTeam();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this team."
  );

  const teamQuery = useGetTeam(id);
  const editMutation = useEditTeam(id);
  const deleteMutation = useDeleteTeam(id);

  const isPending = editMutation.isPending || deleteMutation.isPending;
  const isLoading = teamQuery.isLoading;

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

  const defaultValues = teamQuery.data
    ? {
        name: teamQuery.data.name,
      }
    : {
        name: "",
      };

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Team</SheetTitle>
            <SheetDescription>Edit an existing team</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <TeamForm
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
