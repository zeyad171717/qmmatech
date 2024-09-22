import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamsTable } from "./teams-table";

const TeamsPage = () => {
  return (
    <Tabs
      className="max-w-screen-2xl mx-auto w-full pb-10 p-6"
      defaultValue="teams"
    >
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="teams">Teams</TabsTrigger>
      </TabsList>
      <TabsContent value="teams">
        <TeamsTable />
      </TabsContent>
    </Tabs>
  );
};

export default TeamsPage;
