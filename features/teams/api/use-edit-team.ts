import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.teams)[":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.teams)[":id"]["$patch"]
>["json"];

export const useEditTeam = (id: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.teams[":id"]["$patch"]({
        json,
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Team updated");
      queryClient.invalidateQueries({ queryKey: ["team", { id }] });
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
    onError: () => {
      toast.error("Failed to edit team");
    },
  });

  return mutation;
};
