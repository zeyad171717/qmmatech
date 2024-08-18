import { InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.messages)["archive"][":id"]["$delete"]
>;

export const useArchiveMessage = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async (json) => {
      const response = await client.api.messages["archive"][":id"]["$delete"]({
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Message archived");
      queryClient.invalidateQueries({ queryKey: ["message", { id }] });
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      queryClient.invalidateQueries({ queryKey: ["archived-messages"] });
    },
    onError: () => {
      toast.error("Failed to archive message");
    },
  });

  return mutation;
};
