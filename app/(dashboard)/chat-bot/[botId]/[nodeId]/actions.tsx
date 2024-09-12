import { useEditNodeIndex } from "@/features/nodes/api/use-edit-node-index";
import { ArrowDown, ArrowUp } from "lucide-react";

type Props = {
  id: string;
  index: number;
};

export const Actions = ({ id, index }: Props) => {
  const edit = useEditNodeIndex(id);

  const up = () => {
    edit.mutate({ index: index - 1, state: "up" });
  };

  const down = () => {
    edit.mutate({ index: index + 1, state: "down" });
  };

  return (
    <div className="flex flex-row justify-start items-center">
      <ArrowUp
        onClick={up}
        className="text-slate-800 max-w-8 min-w-8 max-h-8 min-h-8 cursor-pointer rounded-md hover:bg-slate-200 p-2"
      />
      <ArrowDown
        onClick={down}
        className="text-slate-800 max-w-8 min-w-8 max-h-8 min-h-8 cursor-pointer rounded-md hover:bg-slate-200 p-2"
      />
    </div>
  );
};
