"use client";

import useDisplayDataStore from "@/lib/store/DisplayDataStore";
import useLogGpsStore from "@/lib/store/LogGpsStore";
import {
  LineChart,
  Slider,
  Card,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/common";
import { useEffect, useMemo, useState } from "react";
import { isNumber } from "@/lib/utils";
import { mean, median, mode } from "mathjs";

const LogChart = () => {
  const allData = useLogGpsStore((state) => state.allData);
  const gpsData = useLogGpsStore((state) => state.gpsData);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDot, setSelectedDot] = useState<{
    dataKey: string;
    index: number;
  } | null>(null);

  const [displayRange, setDisplayRange] = useState<number[]>([
    0,
    gpsData.length - 1,
  ]);

  useEffect(() => {
    setDisplayRange([0, gpsData.length - 1]);
  }, [gpsData.length]);

  const markerOn = useDisplayDataStore((state) => state.markerOn);
  const setMarkerOn = useDisplayDataStore((state) => state.setMarkerOn);

  const allSelected = useDisplayDataStore((state) => state.allSelected);

  const displayData = useMemo(
    () => allData.slice(displayRange[0], displayRange[1]),
    [allData, displayRange]
  );

  useEffect(() => {
    if (!markerOn) {
      setSelectedDot(null);
      return;
    }

    const index = allData.findIndex((value) => {
      return (
        value.Latitude === markerOn.Latitude &&
        value.Longitude === markerOn.Longitude &&
        value["UTC Time"] === markerOn["UTC Time"]
      );
    });

    if (allSelected.length > 0 && selectedDot?.index !== index) {
      setDisplayRange([0, gpsData.length - 1]);
      setSelectedDot({ dataKey: allSelected[0], index: index });
      setSelectedCategory(allSelected[0]);
    }
  }, [allData, allSelected, gpsData, markerOn, selectedDot?.index]);

  const categoryValues = useMemo(() => {
    if (!selectedCategory) return [];

    return displayData
      .filter((item) => isNumber(item[selectedCategory]))
      .map((val) => Number((val[selectedCategory] as number).toFixed(3)));
  }, [displayData, selectedCategory]);

  const categoryMax = useMemo(() => {
    return Math.max(...categoryValues);
  }, [categoryValues]);

  const categoryMin = useMemo(() => {
    return Math.min(...categoryValues);
  }, [categoryValues]);

  const entriesNumber = useMemo(() => {
    return categoryValues.length;
  }, [categoryValues]);

  const categoryMean = useMemo(() => {
    if (categoryValues.length === 0) return 0;

    return Number(mean(categoryValues).toFixed(3));
  }, [categoryValues]);

  const categoryMedian = useMemo(() => {
    if (categoryValues.length === 0) return 0;

    return Number(median(categoryValues).toFixed(3));
  }, [categoryValues]);

  const categoryMode = useMemo(() => {
    if (categoryValues.length === 0) return 0;

    return Number(mode(categoryValues)[0].toFixed(3));
  }, [categoryValues]);

  if (allSelected.length === 0) {
    return (
      <div className="w-full h-full row-span-2 flex items-center justify-center text-3xl font-mono">
        Select data to display
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
            setMarkerOn(null);
            setSelectedDot(null);
            return;
          }

          if (value.eventType === "dot") {
            setSelectedCategory(value.categoryClicked);
            setSelectedDot({
              dataKey: value.categoryClicked,
              index: value!.index as number,
            });
            setMarkerOn({
              Latitude: value!.Latitude as number,
              Longitude: value!.Longitude as number,
              "UTC Time": value["UTC Time"] as string,
            });
          } else {
            setMarkerOn(null);
            setSelectedDot(null);
            setSelectedCategory(value.categoryClicked);
          }
        }}
        xAxisLabel="Time"
        highlightedCategory={selectedCategory ?? undefined}
        highlightedDot={selectedDot ?? undefined}
      />
      <div className="mt-4 h-full grid grid-rows-[auto_auto_1fr] gap-4">
        <div className="flex flex-col items-center gap-2">
          <Slider
            max={gpsData.length - 1}
            step={1}
            minStepsBetweenThumbs={10}
            defaultValue={[0, gpsData.length - 1]}
            onValueChange={(value) => {
              setMarkerOn(null);
              setSelectedDot(null);
              setDisplayRange(value);
            }}
            value={displayRange}
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
        <div>
          <Select
            value={selectedCategory ?? ""}
            onValueChange={(value) => {
              setSelectedDot(null);
              setMarkerOn(null);
              setSelectedCategory(value);
            }}
          >
            <SelectTrigger className="font-sans">
              <SelectValue
                placeholder="Select category"
                className="font-sans"
              />
            </SelectTrigger>
            <SelectContent className="font-sans">
              {allSelected.map((selectedItem) => (
                <SelectItem
                  className="font-sans"
                  disabled={
                    displayData.filter((item) => isNumber(item[selectedItem]))
                      .length == 0
                  }
                  key={selectedItem}
                  value={selectedItem}
                >
                  {selectedItem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                  {categoryMean}
                </p>
              </Card>
              <Card className="h-full flex flex-col justify-center gap-1 items-center w-48">
                <h4 className="text-slate-400 font-sans">Median</h4>
                <p className="text-slate-950 font-mono font-semibold text-4xl">
                  {categoryMedian}
                </p>
              </Card>
              <Card className="h-full flex flex-col justify-center gap-1 items-center w-48">
                <h4 className="text-slate-400 font-sans">Mode</h4>
                <p className="text-slate-950 font-mono font-semibold text-4xl">
                  {categoryMode}
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
