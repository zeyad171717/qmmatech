import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.permissions)[":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.permissions)[":id"]["$patch"]
>["json"];

export const useEditPermission = (id: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.permissions[":id"]["$patch"]({
        json,
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Permission updated");
      queryClient.invalidateQueries({ queryKey: ["permission", { id }] });
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    },
    onError: () => {
      toast.error("Failed to edit permission");
    },
  });

  return mutation;
};
