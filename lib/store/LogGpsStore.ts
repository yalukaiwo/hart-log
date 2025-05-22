import { create } from "zustand";
import { convertFlatValuesToNumbers } from "../utils";

export interface ILogGpsStore {
  logFilename: string | undefined;
  logData: ILogData[];
  logKeys: (keyof ILogData)[];

  gpsFilename: string | undefined;
  gpsData: IGpsData[];
  gpsKeys: (keyof IGpsData)[];

  allData: (ILogData & IGpsData & { "UTC Time": string })[];

  updateLogFilename: (filename: ILogGpsStore["logFilename"]) => void;
  updateLogData: (data: ILogGpsStore["logData"]) => void;
  updateLogKeys: (data: ILogGpsStore["logKeys"]) => void;

  updateGpsFilename: (filename: ILogGpsStore["gpsFilename"]) => void;
  updateGpsData: (data: ILogGpsStore["gpsData"]) => void;
  updateGpsKeys: (data: ILogGpsStore["gpsKeys"]) => void;

  formatData: () => void;

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
): (ILogData & IGpsData & { "UTC Time": string })[] {
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
    })
  );

  return allData as (ILogData & IGpsData & { "UTC Time": string })[];
}

const useLogStore = create<ILogGpsStore>((set) => ({
  logFilename: undefined,
  logData: [],
  logKeys: [],

  gpsFilename: undefined,
  gpsData: [],
  gpsKeys: [],

  allData: [],

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
}));

export default useLogStore;
