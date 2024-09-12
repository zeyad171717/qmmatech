import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.interactiveWords)[":id"]["$delete"]
>;

export const useDeleteInteractiveWord = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async (json) => {
      const response = await client.api.interactiveWords[":id"]["$delete"]({
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Interactive word deleted");
      queryClient.invalidateQueries({ queryKey: ["interactive-word", { id }] });
      queryClient.invalidateQueries({ queryKey: ["interactive-words"] });
    },
    onError: () => {
      toast.error("Failed to delete interactive word");
    },
  });

  return mutation;
};
