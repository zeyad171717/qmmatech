import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetErrorMessages = () => {
  const query = useQuery({
    queryKey: ["error-messages"],
    queryFn: async () => {
      const response = await client.api.errorMessages.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch error messages");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
