"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { useNewOrganization } from "@/features/organizations/hooks/use-new-organization";
import { useBulkDeleteOrganizations } from "@/features/organizations/api/use-bulk-delete-organizations";
import { useGetOrganizations } from "@/features/organizations/api/use-get-organizations";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { columns } from "./columns";

export const OrganizationsTable = () => {
  const newOrganization = useNewOrganization();
  const deleteOrganizations = useBulkDeleteOrganizations();
  const organizationsQuery = useGetOrganizations();
  const organizations = organizationsQuery.data || [];

  const isDisabled = organizationsQuery.isLoading || deleteOrganizations.isPending;

  if (organizationsQuery.isLoading) {
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
        <CardTitle className="text-xl line-clamp-1">Organizations Page</CardTitle>
        <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
          <Button
            onClick={newOrganization.onOpen}
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
          data={organizations}
          onDelete={(row) => {
            const ids = row.map((r) => r.original.id);
            deleteOrganizations.mutate({ ids });
          }}
          disabled={isDisabled}
        />
      </CardContent>
    </Card>
  );
};
