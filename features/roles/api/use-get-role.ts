import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetRole = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["role", { id }],
    queryFn: async () => {
      const response = await client.api.roles[":id"].$get({
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch role");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
