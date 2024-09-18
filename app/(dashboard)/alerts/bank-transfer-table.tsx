"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { useNewBankTransfer } from "@/features/alerts/hooks/use-new-bank-transfer";
import { useGetBankTransfers } from "@/features/alerts/api/use-get-bank-transfers";
import { columns } from "./bank-transfer-columns";

export const BankTransferTable = () => {
  const newBankTransfer = useNewBankTransfer();
  const bankTransfersQuery = useGetBankTransfers();
  const bankTransfers = bankTransfersQuery.data || [];

  const isDisabled = bankTransfersQuery.isLoading;

  if (bankTransfersQuery.isLoading) {
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
        <CardTitle className="text-xl line-clamp-1">Bank transfer</CardTitle>
        <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
          <Button
            onClick={newBankTransfer.onOpen}
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
          data={bankTransfers}
          disabled={isDisabled}
        />
      </CardContent>
    </Card>
  );
};
