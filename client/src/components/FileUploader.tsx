import { useState, useRef, useCallback } from "react";
import { UploadCloud } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import InfoAlert from "./InfoAlert";
import UploadItem from "./UploadItem";
import { apiRequest } from "@/lib/queryClient";
import { FileUploaderProps } from "@/types";
import { formatFileSize, generateId, getShareableLink } from "@/lib/utils";
import { UploadStatus } from "@shared/schema";
import { addHistoryFile, HistoryFile } from "@/utils/localStorageData";

export default function FileUploader({
  onUploadStart,
  maxFileSize = 100 * 1024 * 1024, // Default max size: 100MB
}: FileUploaderProps) {
  const [uploads, setUploads] = useState<UploadStatus[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const showUploadStatus = uploads.length > 0;

  const handleFileUpload = useCallback(
    async (file: File) => {
      // Create a new upload object
      const uploadId = generateId();
      const newUpload: UploadStatus = {
        id: uploadId,
        fileName: file.name,
        fileSize: formatFileSize(file.size),
        status: "preparing",
        progress: 0,
        cid: null,
        shareableLink: null,
        errorMessage: null,
      };

      // Add to uploads array
      setUploads((prevUploads) => [...prevUploads, newUpload]);

      if (onUploadStart) {
        onUploadStart();
      }

      // File size validation
      if (file.size > maxFileSize) {
        setUploads((prevUploads) =>
          prevUploads.map((upload) =>
            upload.id === uploadId
              ? {
                  ...upload,
                  status: "error",
                  errorMessage: `File too large. Maximum size is ${formatFileSize(
                    maxFileSize
                  )}.`,
                }
              : upload
          )
        );
        return;
      }

      // Set status to uploading and start progress updates
      setUploads((prevUploads) =>
        prevUploads.map((upload) =>
          upload.id === uploadId
            ? { ...upload, status: "uploading", progress: 0 }
            : upload
        )
      );

      // Create FormData for the upload
      const formData = new FormData();
      formData.append("file", file);

      try {
        // Start upload with progress tracking
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            // Cap at 95% until we get the server response
            const cappedProgress = Math.min(progress, 95);

            setUploads((prevUploads) =>
              prevUploads.map((upload) =>
                upload.id === uploadId
                  ? { ...upload, progress: cappedProgress }
                  : upload
              )
            );
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              const cid = response.Hash;
              const shareableLink = getShareableLink(cid);
              const createdAt = new Date().toISOString();
              setUploads((prevUploads) =>
                prevUploads.map((upload) =>
                  upload.id === uploadId
                    ? {
                        ...upload,
                        status: "complete",
                        progress: 100,
                        cid,
                        shareableLink,
                        createdAt,
                      }
                    : upload
                )
              );
              const historyFile: HistoryFile = {
                id: parseInt(uploadId, 16),
                fileName: file.name,
                fileSize: formatFileSize(file.size),
                status: "complete",
                progress: 100,
                cid,
                shareableLink,
                type: file.type,
                createdAt,
                errorMessage: "",
              };
              addHistoryFile(historyFile);
            } catch (error) {
              handleUploadError(uploadId, "Failed to process server response");
            }
          } else {
            handleUploadError(
              uploadId,
              `Server error: ${xhr.status} ${xhr.statusText}`
            );
          }
        });

        xhr.addEventListener("error", () => {
          handleUploadError(uploadId, "Network error occurred during upload");
        });

        xhr.addEventListener("abort", () => {
          handleUploadError(uploadId, "Upload was aborted");
        });

        // Open and send the request
        xhr.open("POST", "/api/upload", true);
        xhr.send(formData);
      } catch (error) {
        handleUploadError(
          uploadId,
          error instanceof Error ? error.message : "Unknown error occurred"
        );
      }
    },
    [maxFileSize, onUploadStart]
  );

  const handleUploadError = (uploadId: string, errorMessage: string) => {
    setUploads((prevUploads) =>
      prevUploads.map((upload) =>
        upload.id === uploadId
          ? { ...upload, status: "error", errorMessage }
          : upload
      )
    );
  };

  const handleRetry = (uploadId: string) => {
    const uploadToRetry = uploads.find((upload) => upload.id === uploadId);
    if (!uploadToRetry) return;

    // Get the original file from the file input (this is a simplification)
    if (fileInputRef.current?.files?.length) {
      const files = Array.from(fileInputRef.current.files);
      const file = files.find((f) => f.name === uploadToRetry.fileName);
      if (file) {
        // Remove the old upload and start a new one
        setUploads((prevUploads) =>
          prevUploads.filter((upload) => upload.id !== uploadId)
        );
        handleFileUpload(file);
      }
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          title: "Success",
          description: "Link copied to clipboard!",
          duration: 3000,
        });
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to copy. Please try again.",
          variant: "destructive",
          duration: 3000,
        });
      });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      Array.from(files).forEach((file) => {
        handleFileUpload(file);
      });
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        handleFileUpload(file);
      });
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <main>
      {/* File Drop Zone */}
      <div
        className={`file-drop-zone rounded-lg p-10 text-center mb-8 cursor-pointer bg-white shadow-sm hover:shadow-md transition-all ${
          isDragging
            ? "active border-blue-500 bg-blue-50"
            : "border-2 border-dashed border-gray-300"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <UploadCloud className="h-16 w-16 mx-auto text-blue-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">
          Drop files here or click to browse
        </h2>
        <p className="text-gray-500 mb-4">
          Upload any file type. No login required.
        </p>
        <input
          type="file"
          id="fileInput"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          multiple
        />
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors">
          Select Files
        </button>
      </div>

      {/* Upload Status */}
      {showUploadStatus && (
        <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Upload Status</h3>

          {uploads.map((upload) => (
            <UploadItem
              key={upload.id}
              upload={upload}
              onRetry={() => handleRetry(upload.id)}
              onCopy={handleCopy}
            />
          ))}
        </div>
      )}

      <InfoAlert />
    </main>
  );
}
