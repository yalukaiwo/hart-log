"use client";
import dynamic from "next/dynamic";

import Header from "@/components/Header";
import LogFileDrawer from "@/components/LogFileDrawer";
import useLogStore from "@/lib/store/LogStore";
import useGpsStore from "@/lib/store/GpsStore";
import { truncateFilename } from "@/lib/utils";
import DataSelect from "@/components/DataSelect";
const TrackMap = dynamic(() => import("@/components/TrackMap"), {
  ssr: false,
});

export default function Home() {
  const logFilename = useLogStore((state) => state.filename);
  const gpsFilename = useGpsStore((state) => state.filename);

  const gpsKeys = useGpsStore((state) => state.keys);

  const isValidGps: boolean =
    gpsKeys.includes("Longitude") && gpsKeys.includes("Latitude");

  return (
    <div className="h-full grid grid-rows-[auto_1fr] text-slate-950 max-h-screen">
      <Header />
      <main className="flex">
        <div className="min-w-96 max-w-96 grid grid-rows-[auto_1fr_250px]">
          <div className="px-4 mt-4">
            <h4 className="font-bold font-sans text-sm">Imported log files:</h4>
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
                No logs imported
              </div>
            ) : (
              <DataSelect />
            )}
          </div>
          <div className="w-full">
            {isValidGps ? (
              <TrackMap />
            ) : (
              <div className="bg-slate-100 font-semibold font-mono text-sm h-full w-full flex items-center justify-center">
                GPS data invalid or unavailable
              </div>
            )}
          </div>
        </div>
        <div className="bg-blue-900 h-full w-full">EKA</div>
      </main>
    </div>
  );
}
