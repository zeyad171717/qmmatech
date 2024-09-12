import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetLinkedMessage = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["linked-message", { id }],
    queryFn: async () => {
      const response = await client.api.linkedMessages["edit"][":id"].$get({
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch linked message");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
