import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.messages)["bulk-delete"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.messages)["bulk-delete"]["$post"]
>["json"];

export const useBulkDeleteMessages = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.messages["bulk-delete"]["$post"]({
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Messages deleted");
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
    onError: () => {
      toast.error("Failed to delete messages");
    },
  });

  return mutation;
};
