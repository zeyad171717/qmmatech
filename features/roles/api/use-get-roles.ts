import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetRoles = (orgId: string) => {
  const query = useQuery({
    queryKey: ["roles", { orgId }],
    queryFn: async () => {
      const response = await client.api.roles[":orgId"].$get({ query: { orgId } });

      if (!response.ok) {
        throw new Error("Failed to fetch roles");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
