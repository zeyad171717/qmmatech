import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetOrganization = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["organization", { id }],
    queryFn: async () => {
      const response = await client.api.organizations[":id"].$get({
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch organization");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
