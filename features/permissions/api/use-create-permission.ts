import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.permissions.$post>;
type RequestType = InferRequestType<typeof client.api.permissions.$post>["json"];

export const useCreatePermission = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.permissions.$post({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Permission created");
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    },
    onError: () => {
      toast.error("Failed to create permission");
    },
  });

  return mutation;
};
