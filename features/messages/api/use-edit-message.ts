import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.messages)[":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.messages)[":id"]["$patch"]
>["json"];

export const useEditMessage = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.messages[":id"]["$patch"]({
        json,
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Message updated");
      queryClient.invalidateQueries({ queryKey: ["message", { id }] });
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
    onError: () => {
      toast.error("Failed to edit message");
    },
  });

  return mutation;
};
