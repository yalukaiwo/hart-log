"use client";

import { ChangeEventHandler, useRef } from "react";
import { Input, Label } from "./common";
import { cx } from "@/lib/utils";

interface IFileInputProps {
  label: string;
  id: string;
  handleChange: ChangeEventHandler<HTMLInputElement>;
  className?: string;
  accept: string;
  note: string;
}

const FileInput = ({
  handleChange,
  label,
  className,
  id,
  note,
  accept,
}: IFileInputProps) => {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className={cx("w-full grid gap-1", className)}>
      <Label htmlFor={id} className="font-sans">
        {label}
      </Label>
      <Input
        id={id}
        className="mt-1.5 font-sans"
        name="logFile"
        type="file"
        accept={accept}
        ref={fileRef}
        onChange={handleChange}
      />
      <p className="mt-0.5 text-xs text-slate-500  font-sans">{note}</p>
    </div>
  );
};

export default FileInput;
