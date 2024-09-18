import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { useSearchParams } from "next/navigation";

export const useGetPayOnReceives = () => {
  const query = useQuery({
    queryKey: ["pay-on-receives"],
    queryFn: async () => {
      const response = await client.api.alerts["pay-on-receive"].$get();

      if (!response.ok) {
        throw new Error("Failed to fetch pay on receive");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
