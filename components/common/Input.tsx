// Tremor Input [v2.0.0]
"use client";

import React from "react";
import { RiEyeFill, RiEyeOffFill, RiSearchLine } from "@remixicon/react";
import { tv, type VariantProps } from "tailwind-variants";

import { cx, focusInput, focusRing, hasErrorInput } from "@/lib/utils";

const inputStyles = tv({
  base: [
    // base
    "relative block w-full appearance-none rounded-md border px-2.5 py-2 shadow-xs outline-hidden transition sm:text-sm",
    // border color
    "border-slate-300 dark:border-slate-800",
    // text color
    "text-slate-900 dark:text-slate-50",
    // placeholder color
    "placeholder-slate-400 dark:placeholder-slate-500",
    // background color
    "bg-white dark:bg-slate-950",
    // disabled
    "disabled:border-slate-300 disabled:bg-slate-100 disabled:text-slate-400",
    "dark:disabled:border-slate-700 dark:disabled:bg-slate-800 dark:disabled:text-slate-500",
    // file
    [
      "file:-my-2 file:-ml-2.5 file:cursor-pointer file:rounded-l-[5px] file:rounded-r-none file:border-0 file:px-3 file:py-2 file:outline-hidden focus:outline-hidden disabled:pointer-events-none file:disabled:pointer-events-none",
      "file:border-solid file:border-slate-300 file:bg-slate-50 file:text-slate-500 file:hover:bg-slate-100 dark:file:border-slate-800 dark:file:bg-slate-950 dark:file:hover:bg-slate-900/20 dark:file:disabled:border-slate-700",
      "file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem]",
      "file:disabled:bg-slate-100 file:disabled:text-slate-500 dark:file:disabled:bg-slate-800",
    ],
    // focus
    focusInput,
    // invalid (optional)
    // "dark:aria-invalid:ring-red-400/20 aria-invalid:ring-2 aria-invalid:ring-red-200 aria-invalid:border-red-500 invalid:ring-2 invalid:ring-red-200 invalid:border-red-500"
    // remove search cancel button (optional)
    "[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden",
  ],
  variants: {
    hasError: {
      true: hasErrorInput,
    },
    // number input
    enableStepper: {
      false:
        "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
    },
  },
});

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputStyles> {
  inputClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      inputClassName,
      hasError,
      enableStepper = true,
      type,
      ...props
    }: InputProps,
    forwardedRef
  ) => {
    const [typeState, setTypeState] = React.useState(type);

    const isPassword = type === "password";
    const isSearch = type === "search";

    return (
      <div className={cx("relative w-full", className)} tremor-id="tremor-raw">
        <input
          ref={forwardedRef}
          type={isPassword ? typeState : type}
          className={cx(
            inputStyles({ hasError, enableStepper }),
            {
              "pl-8": isSearch,
              "pr-10": isPassword,
            },
            inputClassName
          )}
          {...props}
        />
        {isSearch && (
          <div
            className={cx(
              // base
              "pointer-events-none absolute bottom-0 left-2 flex h-full items-center justify-center",
              // text color
              "text-slate-400 dark:text-slate-600"
            )}
          >
            <RiSearchLine
              className="size-[1.125rem] shrink-0"
              aria-hidden="true"
            />
          </div>
        )}
        {isPassword && (
          <div
            className={cx(
              "absolute bottom-0 right-0 flex h-full items-center justify-center px-3"
            )}
          >
            <button
              aria-label="Change password visibility"
              className={cx(
                // base
                "h-fit w-fit rounded-xs outline-hidden transition-all",
                // text
                "text-slate-400 dark:text-slate-600",
                // hover
                "hover:text-slate-500 dark:hover:text-slate-500",
                focusRing
              )}
              type="button"
              onClick={() => {
                setTypeState(typeState === "password" ? "text" : "password");
              }}
            >
              <span className="sr-only">
                {typeState === "password" ? "Show password" : "Hide password"}
              </span>
              {typeState === "password" ? (
                <RiEyeFill aria-hidden="true" className="size-5 shrink-0" />
              ) : (
                <RiEyeOffFill aria-hidden="true" className="size-5 shrink-0" />
              )}
            </button>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, inputStyles, type InputProps };
