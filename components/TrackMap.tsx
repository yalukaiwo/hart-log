"use client";

import { MapContainer, Polyline, TileLayer } from "react-leaflet";
import chroma from "chroma-js";
import useGpsStore from "@/lib/store/GpsStore";
import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./common";
import { isNumber } from "@/lib/utils";

const TrackMap = () => {
  const gpsData = useGpsStore((state) => state.data);
  const gpsKeys = useGpsStore((state) => state.keys).filter(
    (item) =>
      !["UTC Time", "Longitude", "Latitude"].includes(item.toString()) &&
      isNumber(gpsData[0][item])
  );
  const [gpsSelectedParam, setGpsSelectedParam] = useState<string | undefined>(
    undefined
  );

  const handleSelectChange = useMemo(
    () => (data: string) => {
      setGpsSelectedParam(data);
    },
    []
  );

  const segments = useMemo(() => {
    if (!gpsData.length) return [];

    let colorScale = chroma.scale(["darkblue"]);

    if (gpsSelectedParam && gpsData[0][gpsSelectedParam]) {
      const dataVals: number[] = gpsData.map((item) => {
        if (!item[gpsSelectedParam]) return 0;
        return Number(item[gpsSelectedParam]);
      });

      const minV = Math.min(...dataVals);
      const maxV = Math.max(...dataVals);

      colorScale = chroma
        .scale(["green", "yellow", "red"])
        .domain([minV, maxV]);
    }

    return gpsData.slice(1).map((point, i) => {
      const prev = gpsData[i];
      const color = colorScale(
        gpsSelectedParam ? Number(point[gpsSelectedParam]) : 1
      ).hex();

      return (
        <Polyline
          key={`${i}-${color}`} // force remount on color change
          pathOptions={{ color }}
          weight={2}
          positions={[
            [prev.Latitude, prev.Longitude],
            [point.Latitude, point.Longitude],
          ]}
        />
      );
    });
  }, [gpsData, gpsSelectedParam]);

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={[gpsData[0].Latitude, gpsData[0].Longitude]}
        zoom={15}
        className="h-full w-full z-0"
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
        {segments}
      </MapContainer>
      {gpsKeys.length > 0 ? (
        <div className="absolute top-2.5 right-2.5 z-50">
          <Select onValueChange={handleSelectChange}>
            <SelectTrigger className="mx-auto font-sans">
              <SelectValue placeholder="Select" className="font-sans" />
            </SelectTrigger>
            <SelectContent className="font-sans">
              {gpsKeys.map((item) => (
                <SelectItem
                  className="font-sans"
                  key={item.toString()}
                  value={item.toString()}
                >
                  {item.toString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default TrackMap;
