import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetReceiverGift = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["receiver-gift", { id }],
    queryFn: async () => {
      const response = await client.api.alerts["receiver-gift"][":id"].$get({
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch receiver gift");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
