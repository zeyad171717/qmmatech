import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.interactiveWords)["stop"][":id"]["$delete"]
>;

export const useStopInteractiveWord = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async (json) => {
      const response = await client.api.interactiveWords["stop"][":id"]["$delete"]({
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("interactive word stopped");
      queryClient.invalidateQueries({ queryKey: ["interactive-word", { id }] });
      queryClient.invalidateQueries({ queryKey: ["interactive-words"] });
    },
    onError: () => {
      toast.error("Failed to stop interactive word");
    },
  });

  return mutation;
};
