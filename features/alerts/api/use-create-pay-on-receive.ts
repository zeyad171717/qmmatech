import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.alerts["pay-on-receive"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.alerts["pay-on-receive"]["$post"]>;

export const useCreatePayOnReceive = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => {
      const response = await client.api.alerts["pay-on-receive"].$post(data);
      const returnedData = await response.json();

      return returnedData;
    },
    onSuccess: () => {
      toast.success("Pay on receive created");
      queryClient.invalidateQueries({ queryKey: ["pay-on-receives"] });
    },
    onError: () => {
      toast.error("Failed to create pay on receive");
    },
  });

  return mutation;
};
