import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function setCookie(name: string, value: string, maxAgeSeconds: number = 3600) {
  if (typeof window !== 'undefined') {
    window.document.cookie = `${name}=${value}; path=/; max-age=${maxAgeSeconds}; SameSite=Strict`;
  }
}

export function deleteCookie(name: string) {
  if (typeof window !== 'undefined') {
    window.document.cookie = `${name}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict`;
  }
}
