"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArchivedTemplatesTable } from "./archived-templates-table";
import { TemplatesTable } from "./templates-table";

const Templates = () => {
  return (
    <Tabs
      className="max-w-screen-2xl mx-auto w-full pb-10 p-6"
      defaultValue="templates"
    >
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="templates">Templates</TabsTrigger>
        <TabsTrigger value="archived-templates">Archived templates</TabsTrigger>
      </TabsList>
      <TabsContent value="templates">
        <TemplatesTable />
      </TabsContent>
      <TabsContent value="archived-templates">
        <ArchivedTemplatesTable />
      </TabsContent>
    </Tabs>
  );
};

export default Templates;
