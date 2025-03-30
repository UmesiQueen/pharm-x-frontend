import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function truncateAddress(address: string): string {
  if (!address || address.length < 10) return address; // handle invalid/short addresses

  const prefix = address.substring(0, 6); // includes "0x"
  const suffix = address.substring(address.length - 4);

  return `${prefix}...${suffix}`;
}

