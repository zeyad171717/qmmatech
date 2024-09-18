import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetBankTransfer = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["bank-transfer", { id }],
    queryFn: async () => {
      const response = await client.api.alerts["bank-transfer"][":id"].$get({
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch alert");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
