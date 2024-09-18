import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetPayOnReceive = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["pay-on-receive", { id }],
    queryFn: async () => {
      const response = await client.api.alerts["pay-on-receive"][":id"].$get({
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch pay on receive");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
