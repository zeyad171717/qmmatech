import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.alerts)[":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.alerts)[":id"]["$patch"]
>["json"];

export const useEditAlert = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.alerts[":id"]["$patch"]({
        json,
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Alert updated");
      queryClient.invalidateQueries({ queryKey: ["alert", { id }] });
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
    onError: () => {
      toast.error("Failed to edit alert");
    },
  });

  return mutation;
};
