import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChannelsTable } from "./channels-table";

const ChannelsPage = () => {
  return (
    <Tabs
      className="max-w-screen-2xl mx-auto w-full pb-10 p-6"
      defaultValue="channels"
    >
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="channels">Channels</TabsTrigger>
      </TabsList>
      <TabsContent value="channels">
        <ChannelsTable />
      </TabsContent>
    </Tabs>
  );
};

export default ChannelsPage;
