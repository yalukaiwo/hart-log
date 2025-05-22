import { create } from "zustand";
import { convertFlatValuesToNumbers } from "../utils";

function scaleAllFields(
  data: (ILogData & IGpsData & { "UTC Time": string })[],
  excludedKeys = ["UTC Time", "Latitude", "Longitude", "itemIndex"]
): (ILogData & IGpsData & { "UTC Time": string })[] {
  const numericKeys = Object.keys(data[0]).filter(
    (key) =>
      !excludedKeys.includes(key) &&
      data.some((obj) => typeof obj[key] === "number" && !isNaN(obj[key]))
  );

  const allKeys = [...excludedKeys, ...numericKeys];

  // Get min and max for each numeric key
  const minMax = {};
  for (const key of numericKeys) {
    const values = data
      .map((d) => d[key])
      .filter((v) => typeof v === "number" && !isNaN(v));
    const min = Math.min(...(values as number[]));
    const max = Math.max(...(values as number[]));
    minMax[key] = { min, max };
  }

  // Scale each data entry
  const scaledData = data.map((obj) => {
    const newObj = {};
    for (const key of allKeys) {
      const value = obj[key];
      if (excludedKeys.includes(key)) {
        newObj[key] = value;
      } else {
        const { min, max } = minMax[key];
        if (typeof value === "number" && !isNaN(value)) {
          if (min === max) {
            newObj[key] = 0; // avoid divide-by-zero
          } else {
            newObj[key] = ((value - min) / (max - min)) * 1000;
          }
        }
      }
    }
    return newObj;
  });

  return scaledData as (ILogData & IGpsData & { "UTC Time": string })[];
}

export interface ILogGpsStore {
  logFilename: string | undefined;
  logData: ILogData[];
  logKeys: (keyof ILogData)[];

  gpsFilename: string | undefined;
  gpsData: IGpsData[];
  gpsKeys: (keyof IGpsData)[];

  allData: (ILogData & IGpsData & { "UTC Time": string })[];
  allDataScaled: (ILogData & IGpsData & { "UTC Time": string })[];

  updateLogFilename: (filename: ILogGpsStore["logFilename"]) => void;
  updateLogData: (data: ILogGpsStore["logData"]) => void;
  updateLogKeys: (data: ILogGpsStore["logKeys"]) => void;

  updateGpsFilename: (filename: ILogGpsStore["gpsFilename"]) => void;
  updateGpsData: (data: ILogGpsStore["gpsData"]) => void;
  updateGpsKeys: (data: ILogGpsStore["gpsKeys"]) => void;

  formatData: () => void;
  scaleData: () => void;

  clearData: () => void;
}

export interface ILogData {
  [index: string]: string | number;
}

export interface IGpsData extends ILogData {
  Latitude: number;
  Longitude: number;
  "UTC Time": number;
}

function formatData(
  logData: ILogData[],
  gpsData: IGpsData[]
): (ILogData & IGpsData & { "UTC Time": string; itemIndex: number })[] {
  const allData: { [index: string]: string | number }[] = gpsData.map(
    (item, index) => ({
      ...convertFlatValuesToNumbers(item),
      ...convertFlatValuesToNumbers(logData[index] ?? {}),
      "UTC Time": Number(gpsData[index]["UTC Time"] > 0)
        ? item["UTC Time"].toString().slice(0, 2) +
          ":" +
          item["UTC Time"].toString().slice(2, 4) +
          ":" +
          item["UTC Time"].toString().slice(4, 6) +
          "." +
          item["UTC Time"].toString().slice(7, 10)
        : "N/A Time",
      itemIndex: index,
    })
  );

  return allData as (ILogData &
    IGpsData & { "UTC Time": string; itemIndex: number })[];
}

const useLogStore = create<ILogGpsStore>((set) => ({
  logFilename: undefined,
  logData: [],
  logKeys: [],

  gpsFilename: undefined,
  gpsData: [],
  gpsKeys: [],

  allData: [],
  allDataScaled: [],

  updateLogFilename: (newFilename) => {
    set(() => ({
      logFilename: newFilename,
    }));
  },
  updateLogData: (newData) => {
    set(() => ({
      logData: [...newData],
    }));
  },
  updateLogKeys: (newKeys) => {
    set(() => ({
      logKeys: [...newKeys],
    }));
  },
  updateGpsFilename: (newFilename) => {
    set(() => ({
      gpsFilename: newFilename,
    }));
  },
  updateGpsData: (newData) => {
    set(() => ({
      gpsData: [...newData],
    }));
  },
  updateGpsKeys: (newKeys) => {
    set(() => ({
      gpsKeys: [...newKeys],
    }));
  },
  clearData: () => {
    set(() => ({
      gpsKeys: [],
      gpsFilename: undefined,
      gpsData: [],
      logData: [],
      logFilename: undefined,
      logKeys: [],
      allData: [],
    }));
  },

  formatData: () => {
    set((prev) => ({
      allData: formatData(prev.logData, prev.gpsData),
    }));
  },
  scaleData: () => {
    set((prev) => ({
      allDataScaled: scaleAllFields(prev.allData),
    }));
  },
}));

export default useLogStore;
