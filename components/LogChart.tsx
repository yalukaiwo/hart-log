import useDisplayDataStore from "@/lib/store/DisplayDataStore";
import useLogGpsStore from "@/lib/store/LogGpsStore";
import { LineChart, Slider } from "@/components/common";
import { useEffect, useState } from "react";

const LogChart = () => {
  const allData = useLogGpsStore((state) => state.allData);
  const gpsData = useLogGpsStore((state) => state.gpsData);

  const [displayRange, setDisplayRange] = useState<number[]>([
    0,
    gpsData.length,
  ]);

  const allSelected = useDisplayDataStore((state) => state.allSelected);

  useEffect(() => {}, [allData]);

  if (allSelected.length === 0) {
    return (
      <div className="w-full h-full row-span-2 flex items-center justify-center text-3xl font-mono font-semibold">
        Nothing to display
      </div>
    );
  }

  return (
    <>
      <LineChart
        className="h-full font-sans"
        enableLegendSlider
        data={allData.slice(displayRange[0], displayRange[1])}
        tickGap={15}
        index="UTC Time"
        categories={allSelected}
        valueFormatter={(value) => value.toFixed(3).toString()}
        onValueChange={(v) => console.log(v)}
        xAxisLabel="Time"
      />
      <div className="mt-4">
        <div className="flex flex-col items-center gap-2">
          <Slider
            max={gpsData.length - 1}
            step={1}
            defaultValue={[0, gpsData.length - 1]}
            onValueChange={setDisplayRange}
          />
          <div className="font-sans text-sm text-slate-500">
            Time range:{" "}
            <span className="text-slate-950 font-semibold">
              {allData[displayRange[0]]?.["UTC Time"] ?? "?"}
            </span>{" "}
            -{" "}
            <span className="text-slate-950 font-semibold">
              {allData[displayRange[1]]?.["UTC Time"] ?? "?"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogChart;
