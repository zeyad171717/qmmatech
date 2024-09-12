import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.linkedMessages)["stop"][":id"]["$delete"]
>;

export const useStopLinkedMessage = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async (json) => {
      const response = await client.api.linkedMessages["stop"][":id"]["$delete"]({
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Linked message stopped");
      queryClient.invalidateQueries({ queryKey: ["linked-message", { id }] });
      queryClient.invalidateQueries({ queryKey: ["linked-messages"] });
    },
    onError: () => {
      toast.error("Failed to stop linked message");
    },
  });

  return mutation;
};
