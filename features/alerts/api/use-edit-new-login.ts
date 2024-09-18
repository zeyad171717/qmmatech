import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.alerts)["new-login"][":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.alerts)["new-login"][":id"]["$patch"]
>["json"];

export const useEditNewLogin = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.alerts["new-login"][":id"][
        "$patch"
      ]({
        json,
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("New login updated");
      queryClient.invalidateQueries({ queryKey: ["new-login", { id }] });
      queryClient.invalidateQueries({ queryKey: ["new-logins"] });
    },
    onError: () => {
      toast.error("Failed to edit new login");
    },
  });

  return mutation;
};
