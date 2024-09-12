import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.nodes)[":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.nodes)[":id"]["$patch"]
>["json"];

export const useEditNode = (id: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.nodes[":id"]["$patch"]({
        json,
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Node updated");
      queryClient.invalidateQueries({ queryKey: ["node", { id }] });
      queryClient.invalidateQueries({ queryKey: ["nodes"] });
    },
    onError: () => {
      toast.error("Failed to edit node");
    },
  });

  return mutation;
};
