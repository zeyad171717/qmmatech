import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetInteractiveWord = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["interactive-word", { id }],
    queryFn: async () => {
      const response = await client.api.interactiveWords["edit"][":id"].$get({
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch interactive word");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
