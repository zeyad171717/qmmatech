import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.errorMessages)[":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.errorMessages)[":id"]["$patch"]
>["json"];

export const useEditErrorMessage = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.errorMessages[":id"]["$patch"]({
        json,
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Error message updated");
      queryClient.invalidateQueries({ queryKey: ["error-message", { id }] });
      queryClient.invalidateQueries({ queryKey: ["error-messages"] });
    },
    onError: () => {
      toast.error("Failed to edit error message");
    },
  });

  return mutation;
};
