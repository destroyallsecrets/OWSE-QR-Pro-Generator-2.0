import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Simple Base64 encoding/decoding for JSON objects (URL safe)
export const encodeMicrositeData = (data: any): string => {
  try {
    const json = JSON.stringify(data);
    return btoa(encodeURIComponent(json));
  } catch (e) {
    console.error("Encoding error", e);
    return "";
  }
};

export const decodeMicrositeData = (str: string): any => {
  try {
    const json = decodeURIComponent(atob(str));
    return JSON.parse(json);
  } catch (e) {
    console.error("Decoding error", e);
    return null;
  }
};