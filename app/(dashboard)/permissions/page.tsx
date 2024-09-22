import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PermissionsTable } from "./permissions-table";

const PermissionsPage = () => {
  return (
    <Tabs
      className="max-w-screen-2xl mx-auto w-full pb-10 p-6"
      defaultValue="permissions"
    >
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="permissions">Permissions</TabsTrigger>
      </TabsList>
      <TabsContent value="permissions">
        <PermissionsTable />
      </TabsContent>
    </Tabs>
  );
};

export default PermissionsPage;
