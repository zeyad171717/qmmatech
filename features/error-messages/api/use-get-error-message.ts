import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetErrorMessage = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["error-message", { id }],
    queryFn: async () => {
      const response = await client.api.errorMessages[":id"].$get({
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch error message");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
