import useLogGpsStore from "@/lib/store/LogGpsStore";
import DataSelectItem from "./DataSelectItem";
import useDisplayDataStore, {
  IDisplayDataStore,
} from "@/lib/store/DisplayDataStore";
import { useMemo } from "react";
import { CheckedState } from "@radix-ui/react-checkbox";

const DataSelect = () => {
  const logKeys = useLogGpsStore((state) => state.logKeys);
  const gpsKeys = useLogGpsStore((state) => state.gpsKeys);
  const { addLog, removeLog, addGps, removeGps } =
    useDisplayDataStore<IDisplayDataStore>((state) => state);
  const gpsKeysFiltered = gpsKeys.filter(
    (key) => !["Latitude", "Longitude", "UTC Time"].includes(key.toString())
  );

  logKeys.sort();
  gpsKeys.sort();

  const handleLogCheckChange = useMemo<
    (checked: CheckedState, item: string) => void
  >(
    () => (checked, item) => {
      if (checked) {
        addLog(item);
      } else {
        removeLog(item);
      }
    },
    [addLog, removeLog]
  );

  const handleGpsCheckChange = useMemo<
    (checked: CheckedState, item: string) => void
  >(
    () => (checked, item) => {
      if (checked) {
        addGps(item);
      } else {
        removeGps(item);
      }
    },
    [addGps, removeGps]
  );

  return (
    <div className="mt-1.5 overflow-y-scroll max-h-[calc(100vh-484px)]">
      <h5 className="px-4 text-sm font-mono font-semibold text-slate-400">
        ECU
      </h5>
      <div className="mt-0.5">
        {logKeys.length > 0 ? (
          logKeys
            .filter((item) => item.toString().length > 0)
            .map((item, i) => (
              <DataSelectItem
                checkChangeHandler={(checked: CheckedState) => {
                  handleLogCheckChange(checked, item.toString());
                }}
                id={item.toString()}
                key={item.toString() + i}
                label={item.toString()}
              />
            ))
        ) : (
          <div className="font-mono text-sm w-full text-center mt-1.5 text-slate-700">
            File empty or unimported
          </div>
        )}
      </div>
      <h5 className="px-4 mt-2 text-sm font-mono font-semibold text-slate-400">
        GPS
      </h5>
      <div className="mt-1.5">
        {gpsKeysFiltered.length > 0 ? (
          gpsKeysFiltered
            .filter((item) => item.toString().length > 0)
            .map((item, i) => (
              <DataSelectItem
                checkChangeHandler={(checked: CheckedState) => {
                  handleGpsCheckChange(checked, item.toString());
                }}
                id={item.toString()}
                key={item.toString() + i}
                label={item.toString()}
              />
            ))
        ) : (
          <div className="font-mono text-sm w-full text-center mt-1.5 mb-4 text-slate-700">
            {gpsKeys.length > 0 ? "File processed" : "File empty or unimported"}
          </div>
        )}
      </div>
    </div>
  );
};

export default DataSelect;
