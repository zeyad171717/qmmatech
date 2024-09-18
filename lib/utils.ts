import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate({ days = 0, hours = 0, minutes = 0 }) {
  const timeParts = [];

  if (days > 0) {
    timeParts.push(`${days} day${days > 1 ? "s" : ""}`);
  }

  if (hours > 0) {
    timeParts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
  }

  if (minutes > 0) {
    timeParts.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
  }

  const formattedTime =
    timeParts.length > 1
      ? timeParts.slice(0, -1).join(", ") +
        `, and ${timeParts[timeParts.length - 1]}`
      : timeParts[0];

  return `after ${formattedTime}`;
}

export const describeRange = (minValue, maxValue) => {
  if (minValue !== 0 && maxValue !== 0) {
    if (minValue >= maxValue) {
      throw new Error("minValue must be less than maxValue");
    }
    return `more than ${minValue}, less than ${maxValue}`;
  }

  if (minValue !== 0) {
    return `more than ${minValue}`;
  }

  if (maxValue !== 0) {
    return `less than ${maxValue}`;
  }

  return "No range specified";
};
