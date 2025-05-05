import useDisplayDataStore from "@/lib/store/DisplayDataStore";
import useLogGpsStore from "@/lib/store/LogGpsStore";
import { LineChart, Slider, Card } from "@/components/common";
import { useMemo, useState } from "react";
import { isNumber } from "@/lib/utils";

const LogChart = () => {
  const allData = useLogGpsStore((state) => state.allData);
  const gpsData = useLogGpsStore((state) => state.gpsData);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [displayRange, setDisplayRange] = useState<number[]>([
    0,
    gpsData.length - 1,
  ]);

  const allSelected = useDisplayDataStore((state) => state.allSelected);

  const displayData = useMemo(
    () => allData.slice(displayRange[0], displayRange[1]),
    [allData, displayRange]
  );

  const categoryMax = useMemo(() => {
    if (!selectedCategory) return 0;

    return Math.max(
      ...displayData
        .filter((item) => isNumber(item[selectedCategory]))
        .map((val) => Number((val[selectedCategory] as number).toFixed(3)))
    );
  }, [displayData, selectedCategory]);

  const categoryMin = useMemo(() => {
    if (!selectedCategory) return 0;

    return Math.min(
      ...displayData
        .filter((item) => isNumber(item[selectedCategory]))
        .map((val) => Number((val[selectedCategory] as number).toFixed(3)))
    );
  }, [displayData, selectedCategory]);

  const entriesNumber = useMemo(() => {
    if (!selectedCategory) return 0;

    return displayData.filter((item) => isNumber(item[selectedCategory]))
      .length;
  }, [displayData, selectedCategory]);

  const categoryAverage = useMemo(() => {
    if (!selectedCategory) return 0;

    return Number(
      displayData
        .filter((item) => isNumber(item[selectedCategory]))
        .reduce((acc, obj) => {
          const val = obj[selectedCategory];
          return acc + (typeof val === "number" ? val : 0);
        }, 0) / entriesNumber
    ).toFixed(3);
  }, [displayData, selectedCategory, entriesNumber]);

  console.log(selectedCategory);

  if (allSelected.length === 0) {
    return (
      <div className="w-full h-full row-span-2 flex items-center justify-center text-3xl font-mono">
        Nothing to display
      </div>
    );
  }

  if (selectedCategory && !allSelected.includes(selectedCategory)) {
    setSelectedCategory(null);
  }

  return (
    <>
      <LineChart
        className="h-full font-sans"
        enableLegendSlider
        data={displayData}
        tickGap={15}
        index="UTC Time"
        categories={allSelected}
        valueFormatter={(value) => value.toFixed(3).toString()}
        onValueChange={(value) => {
          if (!value) {
            setSelectedCategory(null);
            return;
          }

          setSelectedCategory(value.categoryClicked);
        }}
        xAxisLabel="Time"
      />
      <div className="mt-4 h-full grid grid-rows-[auto_1fr] gap-4">
        <div className="flex flex-col items-center gap-2">
          <Slider
            max={gpsData.length - 1}
            step={1}
            minStepsBetweenThumbs={10}
            defaultValue={[0, gpsData.length - 1]}
            onValueChange={setDisplayRange}
          />
          <div className="font-sans text-sm text-slate-400">
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
        {selectedCategory && entriesNumber > 0 ? (
          <div className="w-full h-full max-w-full overflow-x-scroll">
            <div className="flex items-center gap-2 h-full pb-4 min-w-full w-fit justify-center">
              <Card className="h-full flex flex-col justify-center gap-1 items-center w-48">
                <h4 className="text-slate-400 font-sans">Maximum</h4>
                <p className="text-slate-950 font-mono font-semibold text-4xl">
                  {categoryMax}
                </p>
              </Card>
              <Card className="h-full flex flex-col justify-center gap-1 items-center w-48">
                <h4 className="text-slate-400 font-sans">Minimum</h4>
                <p className="text-slate-950 font-mono font-semibold text-4xl">
                  {categoryMin}
                </p>
              </Card>
              <Card className="h-full flex flex-col justify-center gap-1 items-center w-48">
                <h4 className="text-slate-400 font-sans">Mean</h4>
                <p className="text-slate-950 font-mono font-semibold text-4xl">
                  {categoryAverage}
                </p>
              </Card>
              <Card className="h-full flex flex-col justify-center gap-1 items-center w-48">
                <h4 className="text-slate-400 font-sans">Peak-to-peak</h4>
                <p className="text-slate-950 font-mono font-semibold text-4xl">
                  {Number(Math.abs(categoryMax - categoryMin).toFixed(3))}
                </p>
              </Card>
              <Card className="h-full flex flex-col justify-center gap-1 items-center w-48">
                <h4 className="text-slate-400 font-sans">Total entries</h4>
                <p className="text-slate-950 font-mono font-semibold text-4xl">
                  {entriesNumber}
                </p>
              </Card>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center font-mono text-sm">
            Select a category with available entries to display more data
          </div>
        )}
      </div>
    </>
  );
};

export default LogChart;
