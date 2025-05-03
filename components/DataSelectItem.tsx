import { Checkbox, Label } from "./common";
import { CheckedState } from "@radix-ui/react-checkbox";

interface IDataSelectItemProps {
  id: string;
  label: string;
  checkChangeHandler: (checked: CheckedState) => void;
}

const DataSelectItem = ({
  id,
  label,
  checkChangeHandler,
}: IDataSelectItemProps) => {
  return (
    <Label
      htmlFor={id}
      className="font-sans text-sm cursor-pointer px-4 py-3 flex items-center justify-between relative hover:bg-slate-100 bg-opacity-20"
    >
      <Checkbox onCheckedChange={checkChangeHandler} id={id} />
      {label}
      <span className="absolute content-none bottom-0 left-0 w-full h-[1px] bg-slate-400 opacity-20"></span>
    </Label>
  );
};

export default DataSelectItem;
