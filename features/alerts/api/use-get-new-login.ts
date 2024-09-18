import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetNewLogin = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["new-login", { id }],
    queryFn: async () => {
      const response = await client.api.alerts["new-login"][":id"].$get({
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch new login");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
