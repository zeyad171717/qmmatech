import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.channels)["bulk-delete"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.channels)["bulk-delete"]["$post"]
>["json"];

export const useBulkDeleteChannels = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.channels["bulk-delete"]["$post"]({
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Channels deleted");
      queryClient.invalidateQueries({ queryKey: ["channels"] });
    },
    onError: () => {
      toast.error("Failed to delete channels");
    },
  });

  return mutation;
};
