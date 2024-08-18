import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.messages)[":id"]["$delete"]
>;

export const useDeleteMessage = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async (json) => {
      const response = await client.api.messages[":id"]["$delete"]({
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Message deleted");
      queryClient.invalidateQueries({ queryKey: ["message", { id }] });
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
    onError: () => {
      toast.error("Failed to delete message");
    },
  });

  return mutation;
};
