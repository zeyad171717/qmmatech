"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteInteractiveWord } from "@/features/interactive-words/api/use-delete-interactive-word";
import { useStopInteractiveWord } from "@/features/interactive-words/api/use-stop-interactive-word";
import { useOpenInteractiveWord } from "@/features/interactive-words/hooks/use-open-interactive-word";
import { useConfirm } from "@/hooks/use-confirm";
import { Archive, Edit, MoreHorizontal, StopCircle, Trash } from "lucide-react";

type Props = {
  id: string;
};

export const Actions = ({ id }: Props) => {
  const [DeleteConfirmDialog, deleteConfirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this word."
  );
  const [StopConfirmDialog, stopConfirm] = useConfirm(
    "Are you sure?",
    "You are about to stop this word."
  );

  const deleteMutation = useDeleteInteractiveWord(id);
  const stopMutation = useStopInteractiveWord(id);
  const { onOpen } = useOpenInteractiveWord();

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
