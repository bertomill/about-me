import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * This function combines multiple CSS class names intelligently
 * It uses clsx to handle conditional classes and twMerge to resolve Tailwind conflicts
 * For example: cn("px-2 px-4", "py-1") will result in "px-4 py-1" (px-4 overrides px-2)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
} 