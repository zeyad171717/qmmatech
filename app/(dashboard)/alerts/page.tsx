"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertsTable } from "./alerts-table";

const AlertsPage = () => {
  return (
    <Tabs
      className="max-w-screen-2xl mx-auto w-full pb-10 p-6"
      defaultValue="alerts"
    >
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="alerts">Alerts</TabsTrigger>
      </TabsList>
      <TabsContent value="alerts">
        <AlertsTable />
      </TabsContent>
    </Tabs>
  );
};

export default AlertsPage;
