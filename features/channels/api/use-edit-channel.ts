import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.channels)[":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.channels)[":id"]["$patch"]
>["json"];

export const useEditChannel = (id: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.channels[":id"]["$patch"]({
        json,
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Channel updated");
      queryClient.invalidateQueries({ queryKey: ["channel", { id }] });
      queryClient.invalidateQueries({ queryKey: ["channels"] });
    },
    onError: () => {
      toast.error("Failed to edit channel");
    },
  });

  return mutation;
};
