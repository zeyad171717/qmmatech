import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.alerts)["bank-transfer"][":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.alerts)["bank-transfer"][":id"]["$patch"]
>["json"];

export const useEditBankTransfer = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.alerts["bank-transfer"][":id"][
        "$patch"
      ]({
        json,
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Bank transfer updated");
      queryClient.invalidateQueries({ queryKey: ["bank-transfer", { id }] });
      queryClient.invalidateQueries({ queryKey: ["bank-transfers"] });
    },
    onError: () => {
      toast.error("Failed to edit bank transfer");
    },
  });

  return mutation;
};
