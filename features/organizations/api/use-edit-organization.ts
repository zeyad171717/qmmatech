import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.organizations)[":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.organizations)[":id"]["$patch"]
>["json"];

export const useEditOrganization = (id: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.organizations[":id"]["$patch"]({
        json,
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Organization updated");
      queryClient.invalidateQueries({ queryKey: ["organization", { id }] });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
    onError: () => {
      toast.error("Failed to edit organization");
    },
  });

  return mutation;
};
