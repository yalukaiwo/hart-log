import { create } from "zustand";

export interface ILogStore {
  filename: string | undefined;
  data: ILogData[];
  keys: (keyof ILogData)[];

  updateFilename: (filename: ILogStore["filename"]) => void;
  updateData: (data: ILogStore["data"]) => void;
  updateKeys: (data: ILogStore["keys"]) => void;
}

export interface ILogData {
  [index: string]: string | number;
}

const useLogStore = create<ILogStore>((set) => ({
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

export default useLogStore;
