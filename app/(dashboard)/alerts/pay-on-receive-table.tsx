"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { columns } from "./pay-on-receive-columns";
import { useNewPayOnReceive } from "@/features/alerts/hooks/use-new-pay-on-receive";
import { useGetPayOnReceives } from "@/features/alerts/api/use-get-pay-on-receives";

export const PayOnReceiveTable = () => {
  const newPayOnReceive = useNewPayOnReceive();
  const payOnReceivesQuery = useGetPayOnReceives();
  const payOnReceives = payOnReceivesQuery.data || [];

  const isDisabled = payOnReceivesQuery.isLoading;

  if (payOnReceivesQuery.isLoading) {
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
        <CardTitle className="text-xl line-clamp-1">Pay on receive</CardTitle>
        <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
          <Button
            onClick={newPayOnReceive.onOpen}
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
          data={payOnReceives}
          disabled={isDisabled}
        />
      </CardContent>
    </Card>
  );
};
