import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { TravelSuggestion } from '@/types/travel'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Travel suggestions are now computed locally in suggestion-utils.ts
