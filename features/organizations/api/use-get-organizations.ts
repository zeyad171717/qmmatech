import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetOrganizations = () => {
  const query = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const response = await client.api.organizations.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch organizations");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
