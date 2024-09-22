import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.organizations)["bulk-delete"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.organizations)["bulk-delete"]["$post"]
>["json"];

export const useBulkDeleteOrganizations = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.organizations["bulk-delete"]["$post"]({
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Organizations deleted");
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
    onError: () => {
      toast.error("Failed to delete organizations");
    },
  });

  return mutation;
};
