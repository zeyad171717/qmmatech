import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.linkedMessages.$post>;
type RequestType = InferRequestType<typeof client.api.linkedMessages.$post>;

export const useCreateLinkedMessage = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => {
      const response = await client.api.linkedMessages.$post(data);
      const returnedData = await response.json();

      return returnedData;
    },
    onSuccess: () => {
      toast.success("Linked message created");
      queryClient.invalidateQueries({ queryKey: ["linkedMessages"] });
    },
    onError: () => {
      toast.error("Failed to create linked message");
    },
  });

  return mutation;
};
