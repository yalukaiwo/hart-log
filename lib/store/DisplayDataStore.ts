import { create } from "zustand";
import { ILogData, IGpsData } from "./LogGpsStore";

export interface IDisplayDataStore {
  selectedGPS: (keyof IGpsData)[];
  selectedLog: (keyof ILogData)[];
  allSelected: string[];

  markerOn: (Omit<IGpsData, "UTC Time"> & { "UTC Time": string }) | null;

  addGps(data: keyof IGpsData): void;
  removeGps(data: keyof IGpsData): void;
  addLog(data: keyof ILogData): void;
  removeLog(data: keyof ILogData): void;
  clearSelection(): void;
  setMarkerOn(
    data: (Omit<IGpsData, "UTC Time"> & { "UTC Time": string }) | null
  ): void;
}

function handleAddGps(
  prevState: IDisplayDataStore,
  newData: keyof IGpsData
): Partial<IDisplayDataStore> {
  if (prevState.selectedGPS.includes(newData)) return {};

  return {
    selectedGPS: [...prevState.selectedGPS, newData],
    allSelected: [...prevState.allSelected, newData.toString()],
  };
}

function handleAddLog(
  prevState: IDisplayDataStore,
  newData: keyof ILogData
): Partial<IDisplayDataStore> {
  if (prevState.selectedLog.includes(newData)) return {};

  return {
    selectedLog: [...prevState.selectedLog, newData],
    allSelected: [...prevState.allSelected, newData.toString()],
  };
}

function handleRemoveGps(
  prevState: IDisplayDataStore,
  remData: keyof IGpsData
): Partial<IDisplayDataStore> {
  return {
    selectedGPS: [...prevState.selectedGPS.filter((el) => el !== remData)],
    allSelected: [
      ...prevState.allSelected.filter((el) => el !== remData.toString()),
    ],
  };
}

function handleRemoveLog(
  prevState: IDisplayDataStore,
  remData: keyof ILogData
): Partial<IDisplayDataStore> {
  return {
    selectedLog: [...prevState.selectedLog.filter((el) => el !== remData)],
    allSelected: [
      ...prevState.allSelected.filter((el) => el !== remData.toString()),
    ],
  };
}

const useDisplayDataStore = create<IDisplayDataStore>((set) => ({
  selectedGPS: [],
  selectedLog: [],
  allSelected: [],

  markerOn: null,

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
  clearSelection: () => {
    set(() => ({ selectedGPS: [], selectedLog: [], allSelected: [] }));
  },
  setMarkerOn: (data) => {
    set(() => ({
      markerOn: data,
    }));
  },
}));

export default useDisplayDataStore;
