import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.alerts)["new-login"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.alerts)["new-login"]["$post"]
>;

export const useCreateNewLogin = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => {
      const response = await client.api.alerts["new-login"].$post(data);
      const returnedData = await response.json();

      return returnedData;
    },
    onSuccess: () => {
      toast.success("New login created");
      queryClient.invalidateQueries({ queryKey: ["new-logins"] });
    },
    onError: () => {
      toast.error("Failed to create new login");
    },
  });

  return mutation;
};
