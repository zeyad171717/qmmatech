import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrganizationsTable } from "./organizations-table";

const OrganizationsPage = () => {
  return (
    <Tabs
      className="max-w-screen-2xl mx-auto w-full pb-10 p-6"
      defaultValue="organizations"
    >
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="organizations">Organizations</TabsTrigger>
      </TabsList>
      <TabsContent value="organizations">
        <OrganizationsTable />
      </TabsContent>
    </Tabs>
  );
};

export default OrganizationsPage;
