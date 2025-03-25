import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getEstimatedTimeRemaining(progress: number): string {
  if (progress <= 0 || progress >= 100) return '';
  
  // Simple estimation - adjust these values based on real-world performance
  const remaining = Math.round((100 - progress) / 10) * 5;
  return `~${remaining}s remaining`;
}

// Helper to determine gateway URL based on CID length
export function getShareableLink(cid: string): string {
  const publicGateway = "https://spfs-gateway.thestratos.net";
  const fallbackGateway = "https://spfs-gateway.thestratos.net";
  
  // Use fallback gateway for CIDs exceeding the 63-character DNS limit
  const usesFallbackGateway = cid.length > 63;
  return `${usesFallbackGateway ? fallbackGateway : publicGateway}/ipfs/${cid}`;
}

// Generate a random ID for upload items
export function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substring(2, 9);
}
