import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.linkedMessages)[":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.linkedMessages)[":id"]["$patch"]
>["json"];

export const useEditLinkedMessage = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.linkedMessages[":id"]["$patch"]({
        json,
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Linked message updated");
      queryClient.invalidateQueries({ queryKey: ["linked-message", { id }] });
      queryClient.invalidateQueries({ queryKey: ["linkedMessages"] });
    },
    onError: () => {
      toast.error("Failed to edit linked message");
    },
  });

  return mutation;
};
