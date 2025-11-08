import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get a media URL from your Backblaze B2 bucket using your custom domain
 * @param filename - The filename in your bucket (e.g., "ranoz.mp4", "banner.png")
 * @returns The full URL using your custom media domain
 */
export function mediaUrl(filename: string): string {
  return `https://media.arrayly.dev/${filename}`
}
