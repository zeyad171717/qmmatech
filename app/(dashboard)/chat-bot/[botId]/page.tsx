import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Page = ({ params: { botId } }: { params: { botId: string } }) => {
  return (
    <Tabs defaultValue="message" className="p-4">
      <TabsList>
        <TabsTrigger value="message">Message</TabsTrigger>
      </TabsList>
      <TabsContent value="message">Message: {botId}</TabsContent>
    </Tabs>
  );
};

export default Page;
