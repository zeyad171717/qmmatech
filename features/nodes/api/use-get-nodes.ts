import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetNodes = (parentBotId: string) => {
  const query = useQuery({
    queryKey: ["nodes", { parentBotId }],
    queryFn: async () => {
      const response = await client.api.nodes.$get({ query: { parentBotId } });

      if (!response.ok) {
        throw new Error("Failed to fetch nodes");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
