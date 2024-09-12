import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.interactiveWords.$post>;
type RequestType = InferRequestType<typeof client.api.interactiveWords.$post>;

export const useCreateInteractiveWord = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => {
      const response = await client.api.interactiveWords.$post(data);
      const returnedData = await response.json();

      return returnedData;
    },
    onSuccess: () => {
      toast.success("Interactive word created");
      queryClient.invalidateQueries({ queryKey: ["interactive-words"] });
    },
    onError: () => {
      toast.error("Failed to create interactive word");
    },
  });

  return mutation;
};
