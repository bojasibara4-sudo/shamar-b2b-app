import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge proprement les classes Tailwind
 * Helper standard Next.js / design-system
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
