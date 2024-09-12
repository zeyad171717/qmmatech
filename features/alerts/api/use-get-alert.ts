import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetAlert = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["alert", { id }],
    queryFn: async () => {
      const response = await client.api.alerts[":id"].$get({
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
