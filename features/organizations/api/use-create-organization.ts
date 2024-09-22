import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.organizations.$post>;
type RequestType = InferRequestType<typeof client.api.organizations.$post>["json"];

export const useCreateOrganization = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.organizations.$post({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Organization created");
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
    onError: () => {
      toast.error("Failed to create organization");
    },
  });

  return mutation;
};
