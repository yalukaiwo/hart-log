"use client";
import dynamic from "next/dynamic";

import Header from "@/components/Header";
import LogFileDrawer from "@/components/LogFileDrawer";
import useLogGpsStore from "@/lib/store/LogGpsStore";
import { truncateFilename } from "@/lib/utils";
import DataSelect from "@/components/DataSelect";
import LogChart from "@/components/LogChart";
import useWindowDimensions from "@/lib/hooks/useWindowDimensions";
import { useEffect, useState } from "react";
const TrackMap = dynamic(() => import("@/components/TrackMap"), {
  ssr: false,
});

export default function Home() {
  const { width, height } = useWindowDimensions();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logFilename = useLogGpsStore((state) => state.logFilename);
  const gpsFilename = useLogGpsStore((state) => state.gpsFilename);

  const gpsKeys = useLogGpsStore((state) => state.gpsKeys);

  const isValidGps: boolean =
    gpsKeys.includes("Longitude") && gpsKeys.includes("Latitude");

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return null;
  }

  if (width < 1200 || height < 650) {
    return (
      <div className="text-slate-950 dark:text-slate-50 w-screen text-center flex-col h-screen font-mono text-3xl flex items-center justify-center font-bold">
        Screen too small
        <p className="text-center text-xl font-sans font-normal mt-5">
          To use the telemetry visualizer select a bigger device
        </p>
      </div>
    );
  }

  return (
    <div className="h-full grid grid-rows-[auto_1fr] text-slate-950 max-h-screen dark:text-slate-50">
      <Header />
      <main className="flex gap-4">
        <div className="min-w-96 max-w-96 grid grid-rows-[auto_1fr_250px]">
          <div className="px-4 mt-4">
            <h4 className="font-bold font-sans text-sm">
              Imported telemetry files:
            </h4>
            <div className="mt-1.5">
              <p className="text-sm font-semibold font-sans">
                ECU:{" "}
                <span className="font-mono text-sm font-normal">
                  {truncateFilename(logFilename || "No file loaded", 36)}
                </span>
              </p>
              <p className="text-sm font-sans mt-0.5 mb-1.5 font-semibold">
                GPS:{" "}
                <span className="font-mono text-sm font-normal">
                  {truncateFilename(gpsFilename || "No file loaded", 36)}
                </span>
              </p>
              <LogFileDrawer />
            </div>
          </div>
          <div className="mt-4">
            <h4 className="font-sans text-sm font-bold px-4">Select data</h4>
            {!logFilename && !gpsFilename ? (
              <div className="font-mono text-sm grow w-full text-center mt-1.5">
                No files imported
              </div>
            ) : (
              <DataSelect />
            )}
          </div>
          <div className="w-full">
            {isValidGps ? (
              <TrackMap />
            ) : (
              <div className="bg-slate-100 dark:bg-slate-900 font-mono text-sm h-full w-full flex items-center justify-center">
                GPS data invalid or unavailable
              </div>
            )}
          </div>
        </div>
        <div className="h-full w-full p-4 box-border grid grid-rows-[1fr_250px]">
          <LogChart />
        </div>
      </main>
    </div>
  );
}
