import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetUsers = (orgId: string) => {
  const query = useQuery({
    queryKey: ["users", { orgId }],
    queryFn: async () => {
      const response = await client.api.users["/:orgId"].$get({
        param: { orgId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
