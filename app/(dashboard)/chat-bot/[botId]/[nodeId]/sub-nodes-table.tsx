"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { columns } from "./columns";
import { useGetSubNodes } from "@/features/nodes/api/use-get-sub-nodes";

type Props = {
  parentId: string;
};

export const SubNodesTable = ({ parentId }: Props) => {
  const nodesQuery = useGetSubNodes(parentId);
  const nodes = nodesQuery.data || [];

  const isDisabled = nodesQuery.isLoading;

  if (nodesQuery.isLoading) {
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
        <CardTitle className="text-xl line-clamp-1">Sub Nodes Page</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={nodes}
          disabled={isDisabled}
        />
      </CardContent>
    </Card>
  );
};
