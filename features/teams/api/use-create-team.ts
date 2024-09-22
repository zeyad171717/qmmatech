import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.teams.$post>;
type RequestType = InferRequestType<typeof client.api.teams.$post>["json"];

export const useCreateTeam = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.teams.$post({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Team created");
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
    onError: () => {
      toast.error("Failed to create team");
    },
  });

  return mutation;
};
