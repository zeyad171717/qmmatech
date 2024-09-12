import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.linkedMessages)[":id"]["$delete"]
>;

export const useDeleteLinkedMessage = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async (json) => {
      const response = await client.api.linkedMessages[":id"]["$delete"]({
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Linked message deleted");
      queryClient.invalidateQueries({ queryKey: ["linked-message", { id }] });
      queryClient.invalidateQueries({ queryKey: ["linkedMessages"] });
    },
    onError: () => {
      toast.error("Failed to delete linked message");
    },
  });

  return mutation;
};
