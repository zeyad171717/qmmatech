import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetPermission = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["permission", { id }],
    queryFn: async () => {
      const response = await client.api.permissions[":id"].$get({
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch permission");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
