import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.bots.$post>;
type RequestType = InferRequestType<typeof client.api.bots.$post>["json"];

export const useCreateBot = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.bots.$post({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Bot created");
      queryClient.invalidateQueries({ queryKey: ["bots"] });
    },
    onError: () => {
      toast.error("Failed to create bot");
    },
  });

  return mutation;
};
