import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { useSearchParams } from "next/navigation";

export const useGetArchivedMessages = () => {
  const query = useQuery({
    queryKey: ["archived-messages"],
    queryFn: async () => {
      const response = await client.api.messages["archived"]["$get"]();

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
