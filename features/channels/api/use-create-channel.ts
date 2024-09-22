import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.channels.$post>;
type RequestType = InferRequestType<typeof client.api.channels.$post>["json"];

export const useCreateChannel = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.channels.$post({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Channel created");
      queryClient.invalidateQueries({ queryKey: ["channels"] });
    },
    onError: () => {
      toast.error("Failed to create channel");
    },
  });

  return mutation;
};
