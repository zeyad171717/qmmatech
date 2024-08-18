import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { useSearchParams } from "next/navigation";

export const useGetMessageTypes = () => {
  const query = useQuery({
    queryKey: ["message-types"],
    queryFn: async () => {
      const response = await client.api.messages["types"]["$get"]();

      if (!response.ok) {
        throw new Error("Failed to fetch message types");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
