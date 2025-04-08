import { useState } from "react";
import { Check, Clipboard, AlertCircle } from "lucide-react";
import { UploadItemProps } from "@/types";
import { getEstimatedTimeRemaining } from "@/lib/utils";

export default function UploadItem({
  upload,
  onRetry,
  onCopy,
}: UploadItemProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (upload.shareableLink) {
      onCopy(upload.shareableLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="upload-item border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium truncate">{upload.fileName}</span>
        <span className="text-sm text-gray-500">{upload.fileSize}</span>
      </div>

      {/* Progress Bar - Shown during upload */}
      {(upload.status === "preparing" || upload.status === "uploading") && (
        <div className="progress-state">
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div
              className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${upload.progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>
              {upload.status === "preparing"
                ? "Preparing..."
                : `Uploading... ${Math.round(upload.progress)}%`}
            </span>
            <span>{getEstimatedTimeRemaining(upload.progress)}</span>
          </div>
        </div>
      )}

      {/* Success State */}
      {upload.status === "complete" && (
        <div className="success-state">
          <div className="flex items-center text-green-500 mb-2">
            <Check className="h-5 w-5 mr-2" />
            <span>Upload Complete</span>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-grow min-w-0">
              <p className="text-xs text-gray-500 mb-1">Shareable Link:</p>
              <input
                type="text"
                value={upload.shareableLink}
                readOnly
                className="w-full font-mono text-sm bg-white px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex-shrink-0 mt-5">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors w-full sm:w-auto"
                onClick={handleCopy}
              >
                <Clipboard className="h-4 w-4 mr-2" />
                {isCopied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
          <div className="flex items-center text-green-500 mb-2">
            <p className="text-xs text-gray-500 mb-1">Created At:</p>
            <p
              className="text-xs text-gray-500 mb-1   "
              style={{ marginLeft: 5 }}
            >
              {upload.createdAt
                ? new Date(upload.createdAt).toLocaleString()
                : "N/A"}
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {upload.status === "error" && (
        <div className="error-state">
          <div className="flex items-center text-red-500 mb-2">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>Upload Failed</span>
          </div>
          <p className="text-sm text-gray-600">
            {upload.errorMessage || "An unknown error occurred"}
          </p>
          <button
            className="mt-2 text-blue-500 hover:text-blue-600 text-sm font-medium"
            onClick={onRetry}
          >
            Retry Upload
          </button>
        </div>
      )}
    </div>
  );
}
