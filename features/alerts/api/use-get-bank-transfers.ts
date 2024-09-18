import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { useSearchParams } from "next/navigation";

export const useGetBankTransfers = () => {
  const query = useQuery({
    queryKey: ["bank-transfers"],
    queryFn: async () => {
      const response = await client.api.alerts["bank-transfer"].$get();

      if (!response.ok) {
        throw new Error("Failed to fetch alerts");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
