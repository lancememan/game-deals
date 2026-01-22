import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Params
export function getNumberParam(params: URLSearchParams, key: string): number | undefined {
  const value = params.get(key);
  return value !== null ? Number(value) : undefined;
}

export function getBooleanParam(params: URLSearchParams, key: string): boolean | undefined {
  const value = params.get(key);
  if (value === null) return undefined;
  return value === "1" || value.toLowerCase() === "true";
}

export function getStringParam(params: URLSearchParams, key: string): string | undefined {
  return params.get(key) || undefined;
}
