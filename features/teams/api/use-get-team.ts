import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetTeam = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["team", { id }],
    queryFn: async () => {
      const response = await client.api.teams[":id"].$get({
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch team");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
