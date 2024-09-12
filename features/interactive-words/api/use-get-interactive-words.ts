import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { useSearchParams } from "next/navigation";

export const useGetInteractiveWords = (nodeId: string) => {
  const query = useQuery({
    queryKey: ["interactive-words"],
    queryFn: async () => {
      const response = await client.api.interactiveWords[":nodeId"].$get({
        param: { nodeId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch interactive words");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
