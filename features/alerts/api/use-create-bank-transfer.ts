import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.alerts)["bank-transfer"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.alerts)["bank-transfer"]["$post"]
>;

export const useCreateBankTransfer = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => {
      const response = await client.api.alerts["bank-transfer"].$post(data);
      const returnedData = await response.json();

      return returnedData;
    },
    onSuccess: () => {
      toast.success("Bank transfer created");
      queryClient.invalidateQueries({ queryKey: ["bank-transfers"] });
    },
    onError: () => {
      toast.error("Failed to create bank transfer");
    },
  });

  return mutation;
};
