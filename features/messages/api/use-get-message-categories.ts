import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { useSearchParams } from "next/navigation";

export const useGetMessageCategories = () => {
  const query = useQuery({
    queryKey: ["message-categories"],
    queryFn: async () => {
      const response = await client.api.messages["categories"]["$get"]();

      if (!response.ok) {
        throw new Error("Failed to fetch message categories");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
