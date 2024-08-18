import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetBots = (parentBotId?: string) => {
  const query = useQuery({
    queryKey: ["bots"],
    queryFn: async () => {
      const response = await client.api.bots.$get({ query: { parentBotId } });

      if (!response.ok) {
        throw new Error("Failed to fetch bots");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
