import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.interactiveWords)["bulk-delete"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.interactiveWords)["bulk-delete"]["$post"]
>["json"];

export const useBulkDeleteInteractiveWords = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.interactiveWords["bulk-delete"]["$post"]({
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Interactive words deleted");
      queryClient.invalidateQueries({ queryKey: ["interactive-words"] });
    },
    onError: () => {
      toast.error("Failed to delete interactive words");
    },
  });

  return mutation;
};
