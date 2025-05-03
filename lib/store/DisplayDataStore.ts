import { create } from "zustand";
import { IGpsData } from "./GpsStore";
import { ILogData } from "./LogStore";

export interface IDisplayDataStore {
  selectedGPS: (keyof IGpsData)[];
  selectedLog: (keyof ILogData)[];

  addGps(data: keyof IGpsData): void;
  removeGps(data: keyof IGpsData): void;
  addLog(data: keyof ILogData): void;
  removeLog(data: keyof ILogData): void;
}

function handleAddGps(
  prevState: IDisplayDataStore,
  newData: keyof IGpsData
): Partial<IDisplayDataStore> {
  if (prevState.selectedGPS.includes(newData)) return {};

  return { selectedGPS: [...prevState.selectedGPS, newData] };
}

function handleAddLog(
  prevState: IDisplayDataStore,
  newData: keyof ILogData
): Partial<IDisplayDataStore> {
  if (prevState.selectedLog.includes(newData)) return {};

  return { selectedLog: [...prevState.selectedLog, newData] };
}

function handleRemoveGps(
  prevState: IDisplayDataStore,
  remData: keyof IGpsData
): Partial<IDisplayDataStore> {
  return {
    selectedGPS: [...prevState.selectedGPS.filter((el) => el !== remData)],
  };
}

function handleRemoveLog(
  prevState: IDisplayDataStore,
  remData: keyof ILogData
): Partial<IDisplayDataStore> {
  return {
    selectedLog: [...prevState.selectedLog.filter((el) => el !== remData)],
  };
}

const useDisplayDataStore = create<IDisplayDataStore>((set) => ({
  selectedGPS: [],
  selectedLog: [],

  addGps: (data) => {
    set((prev) => handleAddGps(prev, data));
  },
  removeGps: (data) => {
    set((prev) => handleRemoveGps(prev, data));
  },
  addLog: (data) => {
    set((prev) => handleAddLog(prev, data));
  },
  removeLog: (data) => {
    set((prev) => handleRemoveLog(prev, data));
  },
}));

export default useDisplayDataStore;
