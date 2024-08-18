"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useArchiveMessage } from "@/features/messages/api/use-archive-message";
import { useDeleteMessage } from "@/features/messages/api/use-delete-message";
import { useStopMessage } from "@/features/messages/api/use-stop-message";
import { useOpenMessage } from "@/features/messages/hooks/use-open-message";
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
  const [ArchiveConfirmDialog, archiveConfirm] = useConfirm(
    "Are you sure?",
    "You are about to archive this message."
  );
  const [StopConfirmDialog, stopConfirm] = useConfirm(
    "Are you sure?",
    "You are about to stop this message."
  );

  const deleteMutation = useDeleteMessage(id);
  const archiveMutation = useArchiveMessage(id);
  const stopMutation = useStopMessage(id);
  const { onOpen } = useOpenMessage();

  const handleDelete = async () => {
    const ok = await deleteConfirm();

    if (ok) {
      deleteMutation.mutate();
    }
  };

  const handleArchive = async () => {
    const ok = await archiveConfirm();

    if (ok) {
      archiveMutation.mutate();
    }
  };

  const handleStop = async () => {
    const ok = await stopConfirm();

    if (ok) {
      stopMutation.mutate();
    }
  };

  const disabled =
    deleteMutation.isPending ||
    archiveMutation.isPending ||
    stopMutation.isPending;

  return (
    <>
      <DeleteConfirmDialog />
      <ArchiveConfirmDialog />
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
          <DropdownMenuItem disabled={disabled} onClick={handleArchive}>
            <Archive className="size-4 mr-2" />
            Archive
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
