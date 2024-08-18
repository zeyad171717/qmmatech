"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArchivedMessagesTable } from "./archived-messages-table";
import { MessagesTable } from "./messages-table";

const MessagesPage = () => {
  return (
    <Tabs
      className="max-w-screen-2xl mx-auto w-full pb-10 p-6"
      defaultValue="messages"
    >
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="messages">Messages</TabsTrigger>
        <TabsTrigger value="archived-messages">Archived messages</TabsTrigger>
      </TabsList>
      <TabsContent value="messages">
        <MessagesTable />
      </TabsContent>
      <TabsContent value="archived-messages">
        <ArchivedMessagesTable />
      </TabsContent>
    </Tabs>
  );
};

export default MessagesPage;
