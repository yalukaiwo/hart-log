"use client";

import Image from "next/image";
import { Tooltip } from "./common/Tooltip";
import { RiMoonFill, RiSunFill } from "@remixicon/react";
import { useTheme } from "next-themes";

const Header = () => {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <header className="py-3 px-4 flex justify-between box-border items-center shrink-0">
      <Tooltip content="Made by Luka">
        <div className="w-[160px] h-[36px] relative">
          <Image
            src={resolvedTheme === "dark" ? "/logo_dark.png" : "/logo.png"}
            fill
            alt="logo"
            style={{ objectFit: "contain" }}
          />
        </div>
      </Tooltip>
      <div className="flex items-center gap-4">
        <p className="font-mono text-base text-slate-950 dark:text-slate-50">
          Race Telemetry
        </p>
        <Tooltip
          content="Special for Rafael"
          onClick={() => {
            if (resolvedTheme === "dark") {
              setTheme("light");
            } else {
              setTheme("dark");
            }
          }}
        >
          <div className="rounded-md h-7 w-7 flex items-center justify-center hover:dark:bg-slate-800 hover:bg-slate-100 cursor-pointer">
            {resolvedTheme === "dark" ? (
              <RiSunFill className="h-5 w-5" />
            ) : (
              <RiMoonFill className="h-5 w-5" />
            )}
          </div>
        </Tooltip>
      </div>
    </header>
  );
};

export default Header;
