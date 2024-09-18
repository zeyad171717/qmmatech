import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.alerts)["receiver-gift"][":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.alerts)["receiver-gift"][":id"]["$patch"]
>["json"];

export const useEditReceiverGift = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.alerts["receiver-gift"][":id"][
        "$patch"
      ]({
        json,
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Receiver gift updated");
      queryClient.invalidateQueries({ queryKey: ["receiver-gift", { id }] });
      queryClient.invalidateQueries({ queryKey: ["receiver-gifts"] });
    },
    onError: () => {
      toast.error("Failed to edit receiver gift");
    },
  });

  return mutation;
};
