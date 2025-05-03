"use client";

import {
  ChangeEvent,
  ChangeEventHandler,
  Dispatch,
  MouseEventHandler,
  SetStateAction,
  useMemo,
  useState,
} from "react";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./common";
import useLogStore, { ILogData, ILogStore } from "@/lib/store/LogStore";
import useGpsStore, { IGpsData, IGpsStore } from "@/lib/store/GpsStore";
import Papa from "papaparse";
import FileInput from "./FileInput";

function parseCSV<T extends object>(
  file: File,
  setName: Dispatch<SetStateAction<string | undefined>>,
  setData: Dispatch<SetStateAction<T[]>>,
  setKeys: Dispatch<SetStateAction<(keyof T)[]>>
) {
  Papa.parse<T>(file, {
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
      // Set file name
      setName(file.name);

      // Parsed Data Response in array format
      setData(results.data);

      // Filtered Column Names
      setKeys((results.meta.fields as (keyof T)[]) || []);
    },
  });
}

const LogFileDrawer = () => {
  const {
    updateFilename: updateLogFilename,
    updateData: updateLogData,
    updateKeys: updateLogKeys,
  } = useLogStore<ILogStore>((state) => state);

  const {
    updateFilename: updateGpsFilename,
    updateData: updateGpsData,
    updateKeys: updateGpsKeys,
  } = useGpsStore<IGpsStore>((state) => state);

  const [logFilename, setLogFilename] = useState<string | undefined>(undefined);
  const [logData, setLogData] = useState<ILogData[]>([]);
  const [logKeys, setLogKeys] = useState<(keyof ILogData)[]>([]);

  const [gpsFilename, setGpsFilename] = useState<string | undefined>(undefined);
  const [gpsData, setGpsData] = useState<IGpsData[]>([]);
  const [gpsKeys, setGpsKeys] = useState<(keyof IGpsData)[]>([]);

  const handleLogFileChange = useMemo<ChangeEventHandler<HTMLInputElement>>(
    () => (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();

      if (!e.target.files || !e.target.files[0]) {
        setLogFilename(undefined);
        setLogData([]);
        setLogKeys([]);
        return;
      }
      parseCSV(e.target.files[0], setLogFilename, setLogData, setLogKeys);
    },
    []
  );

  const handleGpsFileChange = useMemo<ChangeEventHandler<HTMLInputElement>>(
    () => (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();

      if (!e.target.files || !e.target.files[0]) {
        setGpsFilename(undefined);
        setGpsData([]);
        setGpsKeys([]);
        return;
      }
      parseCSV(e.target.files[0], setGpsFilename, setGpsData, setGpsKeys);
    },
    []
  );

  const handleSave = useMemo<MouseEventHandler<HTMLButtonElement>>(
    () => () => {
      updateGpsFilename(gpsFilename);
      updateGpsData(gpsData);
      updateGpsKeys(gpsKeys);

      updateLogFilename(logFilename);
      updateLogData(logData);
      updateLogKeys(logKeys);

      setGpsFilename(undefined);
      setLogFilename(undefined);
      setLogData([]);
      setLogKeys([]);
      setGpsData([]);
      setGpsKeys([]);
    },
    [
      gpsData,
      gpsFilename,
      gpsKeys,
      logData,
      logFilename,
      logKeys,
      updateGpsData,
      updateGpsFilename,
      updateGpsKeys,
      updateLogData,
      updateLogFilename,
      updateLogKeys,
    ]
  );

  const handleClose = useMemo<MouseEventHandler<HTMLButtonElement>>(
    () => () => {
      setGpsFilename(undefined);
      setLogFilename(undefined);
      setLogData([]);
      setLogKeys([]);
      setGpsData([]);
      setGpsKeys([]);
    },
    []
  );

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="secondary"
          className="font-sans text-sm cursor-pointer w-full"
        >
          Import new
        </Button>
      </DrawerTrigger>
      <DrawerContent className="sm:max-w-lg">
        <DrawerHeader>
          <DrawerTitle className="font-sans">
            Import files to visualize
          </DrawerTitle>
          <DrawerDescription className="mt-1 text-sm font-sans">
            Logs from these files will be parsed and visualized. First log is
            assumed to have started at the same instant.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <FileInput
            id="logFileInput"
            label="Upload the ECU log file"
            handleChange={handleLogFileChange}
            className="mb-4"
            accept=".csv, .MaxxECU-Log"
            note="Accepted file types: .CSV, .MaxxECU-Log"
          />
          <FileInput
            id="gpsFileInput"
            label="Upload the GPS log file"
            handleChange={handleGpsFileChange}
            accept=".csv"
            note="Accepted file types: .CSV"
          />
        </DrawerBody>
        <DrawerFooter className="mt-6">
          <DrawerClose asChild>
            <Button
              className="mt-2 w-full sm:mt-0 sm:w-fit font-sans cursor-pointer"
              variant="secondary"
              onClick={handleClose}
            >
              Cancel
            </Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button
              type="submit"
              disabled={logFilename === undefined && gpsFilename === undefined}
              className="w-full sm:w-fit font-sans cursor-pointer"
              onClick={handleSave}
            >
              Save
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default LogFileDrawer;
