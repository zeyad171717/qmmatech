import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetNode = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["node", { id }],
    queryFn: async () => {
      const response = await client.api.nodes[":id"].$get({
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch node");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
