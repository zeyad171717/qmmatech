"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { columns } from "./interactive-words-columns";
import { useNewInteractiveWord } from "@/features/interactive-words/hooks/use-new-interactive-word";
import { useBulkDeleteInteractiveWords } from "@/features/interactive-words/api/use-bulk-delete-interactive-word";
import { useGetInteractiveWords } from "@/features/interactive-words/api/use-get-interactive-words";

type Props = {
  nodeId: string;
};

export const InteractiveWordsTable = ({ nodeId }: Props) => {
  const newWord = useNewInteractiveWord();
  const deleteWords = useBulkDeleteInteractiveWords();
  const wordsQuery = useGetInteractiveWords(nodeId);
  const words = wordsQuery.data || [];

  const isDisabled = wordsQuery.isLoading || deleteWords.isPending;

  if (wordsQuery.isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-10">
        <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full flex items-center justify-center">
              <Loader2 className="size-6 text-slate-300 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="gap-y-2 lg:flex-row lg:items-start lg:justify-between">
        <CardTitle className="text-xl line-clamp-1">Interactive Words</CardTitle>
        <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
          <Button
            onClick={() => {
              newWord.setNodeId(nodeId);
              newWord.onOpen();
            }}
            size="sm"
            className="w-full lg:w-auto"
          >
            <Plus className="size-4 mr-2" />
            Add new
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          filterKey="name"
          columns={columns}
          data={words}
          onDelete={(row) => {
            const ids = row.map((r) => r.original.id);
            deleteWords.mutate({ ids });
          }}
          disabled={isDisabled}
        />
      </CardContent>
    </Card>
  );
};
