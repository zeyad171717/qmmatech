import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.bots)[":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.bots)[":id"]["$patch"]
>["json"];

export const useEditBot = (id: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.bots[":id"]["$patch"]({
        json,
        param: { id },
      });
      
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Bot updated");
      queryClient.invalidateQueries({ queryKey: ["bots"] });
    },
    onError: () => {
      toast.error("Failed to edit bot");
    },
  });

  return mutation;
};
