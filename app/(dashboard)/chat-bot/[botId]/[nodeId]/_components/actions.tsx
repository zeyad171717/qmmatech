"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteLinkedMessage } from "@/features/linked-messages/api/use-delete-linked-message";
import { useStopLinkedMessage } from "@/features/linked-messages/api/use-stop-linked-message";
import { useOpenLinkedMessage } from "@/features/linked-messages/hooks/use-open-linked-message";
import { useConfirm } from "@/hooks/use-confirm";
import { Archive, Edit, MoreHorizontal, StopCircle, Trash } from "lucide-react";

type Props = {
  id: string;
};

export const Actions = ({ id }: Props) => {
  const [DeleteConfirmDialog, deleteConfirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this message."
  );
  const [StopConfirmDialog, stopConfirm] = useConfirm(
    "Are you sure?",
    "You are about to stop this message."
  );

  const deleteMutation = useDeleteLinkedMessage(id);
  const stopMutation = useStopLinkedMessage(id);
  const { onOpen } = useOpenLinkedMessage();

  const handleDelete = async () => {
    const ok = await deleteConfirm();

    if (ok) {
      deleteMutation.mutate();
    }
  };

  const handleStop = async () => {
    const ok = await stopConfirm();

    if (ok) {
      stopMutation.mutate();
    }
  };

  const disabled = deleteMutation.isPending || stopMutation.isPending;

  return (
    <>
      <DeleteConfirmDialog />
      <StopConfirmDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem disabled={disabled} onClick={() => onOpen(id)}>
            <Edit className="size-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem disabled={disabled} onClick={handleStop}>
            <StopCircle className="size-4 mr-2" />
            Stop
          </DropdownMenuItem>
          <DropdownMenuItem disabled={disabled} onClick={handleDelete}>
            <Trash className="size-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
