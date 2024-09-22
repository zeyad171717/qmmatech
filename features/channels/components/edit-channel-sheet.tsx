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
import { useOpenChannel } from "../hooks/use-open-channel";
import { useGetChannel } from "../api/use-get-channel";
import { useEditChannel } from "../api/use-edit-channel";
import { useDeleteChannel } from "../api/use-delete-channel";
import { ChannelForm } from "./channel-form";

const formSchema = z.object({
  name: z.string().min(1),
});

type FormValues = z.infer<typeof formSchema>;

export const EditChannelSheet = () => {
  const { isOpen, onClose, id } = useOpenChannel();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this channel."
  );

  const channelQuery = useGetChannel(id);
  const editMutation = useEditChannel(id);
  const deleteMutation = useDeleteChannel(id);

  const isPending = editMutation.isPending || deleteMutation.isPending;

  const isLoading = channelQuery.isLoading;

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

  const defaultValues = channelQuery.data
    ? {
        name: channelQuery.data.name,
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
            <SheetTitle>Edit Channel</SheetTitle>
            <SheetDescription>Edit an existing channel</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <ChannelForm
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
