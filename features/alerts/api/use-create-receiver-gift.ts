import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.alerts)["receiver-gift"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.alerts)["receiver-gift"]["$post"]
>;

export const useCreateReceiverGift = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => {
      const response = await client.api.alerts["receiver-gift"].$post(data);
      const returnedData = await response.json();

      return returnedData;
    },
    onSuccess: () => {
      toast.success("Receiver gift created");
      queryClient.invalidateQueries({ queryKey: ["receiver-gifts"] });
    },
    onError: () => {
      toast.error("Failed to create receiver gift");
    },
  });

  return mutation;
};
