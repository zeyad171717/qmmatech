import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.teams)["bulk-delete"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.teams)["bulk-delete"]["$post"]
>["json"];

export const useBulkDeleteTeams = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.teams["bulk-delete"]["$post"]({
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Teams deleted");
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
    onError: () => {
      toast.error("Failed to delete teams");
    },
  });

  return mutation;
};
