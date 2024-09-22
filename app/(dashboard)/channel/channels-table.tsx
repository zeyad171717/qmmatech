"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { useNewChannel } from "@/features/channels/hooks/use-new-channel";
import { useBulkDeleteChannels } from "@/features/channels/api/use-bulk-delete-channels";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { columns } from "./columns";

export const ChannelsTable = () => {
  const newChannel = useNewChannel();
  const deleteChannels = useBulkDeleteChannels();
  const channelsQuery = useGetChannels();
  const channels = channelsQuery.data || [];

  const isDisabled = channelsQuery.isLoading || deleteChannels.isPending;

  if (channelsQuery.isLoading) {
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
        <CardTitle className="text-xl line-clamp-1">Channels Page</CardTitle>
        <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
          <Button
            onClick={newChannel.onOpen}
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
          data={channels}
          onDelete={(row) => {
            const ids = row.map((r) => r.original.id);
            deleteChannels.mutate({ ids });
          }}
          disabled={isDisabled}
        />
      </CardContent>
    </Card>
  );
};
