import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { useSearchParams } from "next/navigation";

export const useGetLinkedMessages = (nodeId: string) => {
  const query = useQuery({
    queryKey: ["linked-messages"],
    queryFn: async () => {
      const response = await client.api.linkedMessages[":nodeId"].$get({
        param: { nodeId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch linked messages");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
