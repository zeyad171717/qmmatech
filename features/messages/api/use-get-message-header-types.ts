import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { useSearchParams } from "next/navigation";

export const useGetMessageHeaderTypes = () => {
  const query = useQuery({
    queryKey: ["message-header-types"],
    queryFn: async () => {
      const response = await client.api.messages["header-types"]["$get"]();

      if (!response.ok) {
        throw new Error("Failed to fetch message header-types");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
