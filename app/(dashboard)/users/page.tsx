import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersTable } from "./users-table";

const UsersPage = () => {
  return (
    <Tabs
      className="max-w-screen-2xl mx-auto w-full pb-10 p-6"
      defaultValue="users"
    >
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="users">Users</TabsTrigger>
      </TabsList>
      <TabsContent value="users">
        <UsersTable />
      </TabsContent>
    </Tabs>
  );
};

export default UsersPage;
