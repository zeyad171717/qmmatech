import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetMessageButtonTypes = () => {
  const query = useQuery({
    queryKey: ["message-button-types"],
    queryFn: async () => {
      const response = await client.api.messages["button-types"]["$get"]();

      if (!response.ok) {
        throw new Error("Failed to fetch message button types");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
