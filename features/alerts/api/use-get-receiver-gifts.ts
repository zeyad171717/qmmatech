import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { useSearchParams } from "next/navigation";

export const useGetReceiverGifts = () => {
  const query = useQuery({
    queryKey: ["receiver-gifts"],
    queryFn: async () => {
      const response = await client.api.alerts["receiver-gift"].$get();

      if (!response.ok) {
        throw new Error("Failed to fetch receiver gifts");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
