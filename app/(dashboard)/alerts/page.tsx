"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertsTable } from "./alerts-table";
import { AbandantCartsTable } from "./abandant-carts-table";
import { ReceiverGiftTable } from "./receiver-gift-table";
import { PayOnReceiveTable } from "./pay-on-receive-table";
import { BankTransferTable } from "./bank-transfer-table";
import { NewLoginTable } from "./new-login-table";

const AlertsPage = () => {
  return (
    <Tabs
      className="max-w-screen-2xl mx-auto w-full pb-10 p-6"
      defaultValue="alerts"
    >
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="alerts">Alerts</TabsTrigger>
        <TabsTrigger value="abandant-carts">Abandant Carts</TabsTrigger>
        <TabsTrigger value="receiver-gift">Receiver Gift</TabsTrigger>
        <TabsTrigger value="pay-on-receive">Pay On Receive</TabsTrigger>
        <TabsTrigger value="bank-transfer">Bank Transfer</TabsTrigger>
        <TabsTrigger value="new-login">New Login</TabsTrigger>
      </TabsList>
      <TabsContent value="alerts">
        <AlertsTable />
      </TabsContent>
      <TabsContent value="abandant-carts">
        <AbandantCartsTable />
      </TabsContent>
      <TabsContent value="receiver-gift">
        <ReceiverGiftTable />
      </TabsContent>
      <TabsContent value="pay-on-receive">
        <PayOnReceiveTable />
      </TabsContent>
      <TabsContent value="bank-transfer">
        <BankTransferTable />
      </TabsContent>
      <TabsContent value="new-login">
        <NewLoginTable />
      </TabsContent>
    </Tabs>
  );
};

export default AlertsPage;
