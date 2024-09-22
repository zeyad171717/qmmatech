import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.roles)["bulk-delete"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.roles)["bulk-delete"]["$post"]
>["json"];

export const useBulkDeleteRoles = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.roles["bulk-delete"]["$post"]({
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Roles deleted");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: () => {
      toast.error("Failed to delete roles");
    },
  });

  return mutation;
};
