import { create } from "zustand";
import { ILogData } from "./LogStore";

export interface IGpsStore {
  filename: string | undefined;
  data: IGpsData[];
  keys: (keyof IGpsData)[];

  updateFilename: (filename: IGpsStore["filename"]) => void;
  updateData: (data: IGpsStore["data"]) => void;
  updateKeys: (data: IGpsStore["keys"]) => void;
}

export interface IGpsData extends ILogData {
  Latitude: number;
  Longitude: number;
}

const useGpsStore = create<IGpsStore>((set) => ({
  filename: undefined,
  data: [],
  keys: [],

  updateFilename: (newFilename) => {
    set(() => ({
      filename: newFilename,
    }));
  },
  updateData: (newData) => {
    set(() => ({
      data: [...newData],
    }));
  },
  updateKeys: (newKeys) => {
    set(() => ({
      keys: [...newKeys],
    }));
  },
}));

export default useGpsStore;
