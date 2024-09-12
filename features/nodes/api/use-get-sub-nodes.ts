import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetSubNodes = (parentId: string) => {
  const query = useQuery({
    queryKey: ["sub-nodes", { parentId }],
    queryFn: async () => {
      const response = await client.api.nodes["sub-nodes"][":parentId"].$get({
        param: { parentId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch sub nodes");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
