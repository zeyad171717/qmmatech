"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { useNewPermission } from "@/features/permissions/hooks/use-new-permission";
import { useBulkDeletePermissions } from "@/features/permissions/api/use-bulk-delete-permissions";
import { useGetPermissions } from "@/features/permissions/api/use-get-permissions";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { columns } from "./columns";

export const PermissionsTable = () => {
  const newPermission = useNewPermission();
  const deletePermissions = useBulkDeletePermissions();
  const permissionsQuery = useGetPermissions();
  const permissions = permissionsQuery.data || [];

  const isDisabled = permissionsQuery.isLoading || deletePermissions.isPending;

  if (permissionsQuery.isLoading) {
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
        <CardTitle className="text-xl line-clamp-1">Permissions Page</CardTitle>
        <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
          <Button
            onClick={newPermission.onOpen}
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
          data={permissions}
          onDelete={(row) => {
            const ids = row.map((r) => r.original.id);
            deletePermissions.mutate({ ids });
          }}
          disabled={isDisabled}
        />
      </CardContent>
    </Card>
  );
};
