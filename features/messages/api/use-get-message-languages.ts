import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { useSearchParams } from "next/navigation";

export const useGetMessageLanguages = () => {
  const query = useQuery({
    queryKey: ["message-languages"],
    queryFn: async () => {
      const response = await client.api.messages["languages"]["$get"]();

      if (!response.ok) {
        throw new Error("Failed to fetch message languages");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
