import { UploadStatus } from "@shared/schema";

export interface UploadProgressEvent {
  loaded: number;
  total: number;
}

export interface UploadProps {
  file: File;
  onProgress: (progress: number) => void;
  onComplete: (cid: string, shareableLink: string) => void;
  onError: (message: string) => void;
}

export interface FileUploaderProps {
  onUploadStart?: () => void;
  maxFileSize?: number; // in bytes
}

export interface UploadItemProps {
  upload: UploadStatus;
  onRetry: () => void;
  onCopy: (text: string) => void;
}
