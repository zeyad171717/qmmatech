import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RolesTable } from "./roles-table";

const RolesPage = () => {
  return (
    <Tabs
      className="max-w-screen-2xl mx-auto w-full pb-10 p-6"
      defaultValue="roles"
    >
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="roles">Roles</TabsTrigger>
      </TabsList>
      <TabsContent value="roles">
        <RolesTable />
      </TabsContent>
    </Tabs>
  );
};

export default RolesPage;
