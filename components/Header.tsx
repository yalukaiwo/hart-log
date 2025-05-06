"use client";

import Image from "next/image";

const Header = () => {
  return (
    <header className="py-3 px-4 flex justify-between box-border items-center shrink-0">
      <div className="w-[160px] h-[36px] relative">
        <Image
          src="/logo.png"
          fill
          alt="logo"
          style={{ objectFit: "contain" }}
        />
      </div>{" "}
      <p className="font-mono text-base text-slate-950">Telemetry visualizer</p>
    </header>
  );
};

export default Header;
