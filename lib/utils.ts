// Tremor Raw cx [v0.0.0]

import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cx(...args: ClassValue[]) {
  return twMerge(clsx(...args));
}

// Tremor focusInput [v0.0.2]

export const focusInput = [
  // base
  "focus:ring-2",
  // ring color
  "focus:ring-blue-200 dark:focus:ring-blue-700/30",
  // border color
  "focus:border-blue-500 dark:focus:border-blue-700",
];

// Tremor Raw focusRing [v0.0.1]

export const focusRing = [
  // base
  "outline outline-offset-2 outline-0 focus-visible:outline-2",
  // outline color
  "outline-blue-500 dark:outline-blue-500",
];

// Tremor Raw hasErrorInput [v0.0.1]

export const hasErrorInput = [
  // base
  "ring-2",
  // border color
  "border-red-500 dark:border-red-700",
  // ring color
  "ring-red-200 dark:ring-red-700/30",
];

export function truncateFilename(filename: string, maxLength: number): string {
  if (filename.length <= maxLength) return filename;

  const extIndex = filename.lastIndexOf(".");
  if (extIndex === -1 || extIndex === 0) {
    // No extension found or filename starts with dot
    return filename.slice(0, maxLength - 3) + "...";
  }

  const namePart = filename.slice(0, extIndex);
  const ext = filename.slice(extIndex);

  const keepChars = maxLength - ext.length - 3; // 3 for "..."
  if (keepChars <= 0) return "..." + ext;

  const start = Math.ceil(keepChars / 2);
  const end = Math.floor(keepChars / 2);

  return `${namePart.slice(0, start)}...${namePart.slice(
    namePart.length - end
  )}${ext}`;
}

export function isNumber(str) {
  return /^[+-]?\d+(\.\d+)?$/.test(str);
}
