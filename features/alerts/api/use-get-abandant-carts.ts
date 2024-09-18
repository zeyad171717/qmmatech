import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { useSearchParams } from "next/navigation";

export const useGetAbandantCarts = () => {
  const query = useQuery({
    queryKey: ["abandant-carts"],
    queryFn: async () => {
      const response = await client.api.alerts["abandant-carts"].$get();

      if (!response.ok) {
        throw new Error("Failed to fetch abandant carts");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
