import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { useSearchParams } from "next/navigation";

export const useGetAlerts = (nodeId: string) => {
  const query = useQuery({
    queryKey: ["alerts"],
    queryFn: async () => {
      const response = await client.api.alerts.$get({
        param: { nodeId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch alerts");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
