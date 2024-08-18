import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetMessage = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["message", { id }],
    queryFn: async () => {
      const response = await client.api.messages[":id"].$get({
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch message");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
