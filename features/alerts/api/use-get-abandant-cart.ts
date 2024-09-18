import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetAbandantCart = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["abandant-carts", { id }],
    queryFn: async () => {
      const response = await client.api.alerts["abandant-carts"][":id"].$get({
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch abandant carts");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
