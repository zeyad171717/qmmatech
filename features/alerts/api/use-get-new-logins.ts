import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { useSearchParams } from "next/navigation";

export const useGetNewLogins = () => {
  const query = useQuery({
    queryKey: ["new-logins"],
    queryFn: async () => {
      const response = await client.api.alerts["new-login"].$get();

      if (!response.ok) {
        throw new Error("Failed to fetch new logins");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
