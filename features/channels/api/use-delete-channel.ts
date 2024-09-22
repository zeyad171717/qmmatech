import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.channels)[":id"]["$delete"]
>;

export const useDeleteChannel = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async (json) => {
      const response = await client.api.channels[":id"]["$delete"]({
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Channel deleted");
      queryClient.invalidateQueries({ queryKey: ["channel", { id }] });
      queryClient.invalidateQueries({ queryKey: ["channels"] });
    },
    onError: () => {
      toast.error("Failed to delete channel");
    },
  });

  return mutation;
};
