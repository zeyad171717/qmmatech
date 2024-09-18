import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.alerts)["abandant-carts"][":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.alerts)["abandant-carts"][":id"]["$patch"]
>["json"];

export const useEditAbandantCart = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.alerts["abandant-carts"][":id"]["$patch"]({
        json,
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Abandant cart updated");
      queryClient.invalidateQueries({ queryKey: ["abandant-cart", { id }] });
      queryClient.invalidateQueries({ queryKey: ["abandant-carts"] });
    },
    onError: () => {
      toast.error("Failed to edit abandant carts");
    },
  });

  return mutation;
};
