import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.linkedMessages)["bulk-delete"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.linkedMessages)["bulk-delete"]["$post"]
>["json"];

export const useBulkDeleteLinkedMessages = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.linkedMessages["bulk-delete"]["$post"]({
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Linked messages deleted");
      queryClient.invalidateQueries({ queryKey: ["linked-messages"] });
    },
    onError: () => {
      toast.error("Failed to delete linked messages");
    },
  });

  return mutation;
};
