import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.teams)[":id"]["$delete"]
>;

export const useDeleteTeam = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async (json) => {
      const response = await client.api.teams[":id"]["$delete"]({
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Team deleted");
      queryClient.invalidateQueries({ queryKey: ["team", { id }] });
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
    onError: () => {
      toast.error("Failed to delete team");
    },
  });

  return mutation;
};
