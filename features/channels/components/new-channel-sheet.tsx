import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { z } from "zod";
import { useNewChannel } from "../hooks/use-new-channel";
import { useCreateChannel } from "../api/use-create-channel";
import { ChannelForm } from "./channel-form";

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export const NewChannelSheet = () => {
  const { isOpen, onClose } = useNewChannel();

  const mutation = useCreateChannel();

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Channel</SheetTitle>
          <SheetDescription>Create a new channel</SheetDescription>
        </SheetHeader>
        <ChannelForm
          onSubmit={onSubmit}
          disabled={mutation.isPending}
          defaultValues={{
            name: "",
            description: "",
          }}
        />
      </SheetContent>
    </Sheet>
  );
};
