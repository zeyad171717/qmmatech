import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.messages.$post>;
type RequestType = InferRequestType<typeof client.api.messages.$post>;

export const useCreateMessage = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => {
      const response = await client.api.messages.$post(data);
      const returnedData = await response.json();

      return returnedData;
    },
    onSuccess: () => {
      toast.success("Message created");
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
    onError: () => {
      toast.error("Failed to create message");
    },
  });

  return mutation;
};
