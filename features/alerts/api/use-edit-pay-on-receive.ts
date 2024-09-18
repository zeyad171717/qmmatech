import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.alerts)["pay-on-receive"][":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.alerts)["pay-on-receive"][":id"]["$patch"]
>["json"];

export const useEditPayOnReceive = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.alerts["pay-on-receive"][":id"]["$patch"]({
        json,
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Pay on receive updated");
      queryClient.invalidateQueries({ queryKey: ["pay-on-receive", { id }] });
      queryClient.invalidateQueries({ queryKey: ["pay-on-receives"] });
    },
    onError: () => {
      toast.error("Failed to edit pay on receive");
    },
  });

  return mutation;
};
