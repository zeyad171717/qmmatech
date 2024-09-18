import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.alerts)["abandant-carts"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.alerts)["abandant-carts"]["$post"]
>;

export const useCreateAbandantCart = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => {
      const response = await client.api.alerts["abandant-carts"].$post(data);
      const returnedData = await response.json();

      return returnedData;
    },
    onSuccess: () => {
      toast.success("Abandant cart created");
      queryClient.invalidateQueries({ queryKey: ["abandant-carts"] });
    },
    onError: () => {
      toast.error("Failed to create abandant-cart");
    },
  });

  return mutation;
};
