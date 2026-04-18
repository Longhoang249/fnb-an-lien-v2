import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Class name utility — combines clsx + tailwind-merge for conditional
 * Tailwind class merging (same as shadcn/ui's cn helper).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
