import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.nodes.$post>;
type RequestType = InferRequestType<typeof client.api.nodes.$post>["json"];

export const useCreateNode = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.nodes.$post({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Node created");
      queryClient.invalidateQueries({ queryKey: ["nodes"] });
    },
    onError: () => {
      toast.error("Failed to create node");
    },
  });

  return mutation;
};
