import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetChannels = (orgId: string) => {
  const query = useQuery({
    queryKey: ["channels", { orgId }],
    queryFn: async () => {
      const response = await client.api.channels[":orgId"].$get({ query: { orgId } });

      if (!response.ok) {
        throw new Error("Failed to fetch channels");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
