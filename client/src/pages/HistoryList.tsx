import React, { useEffect, useState } from "react";
import { getHistoryFiles, HistoryFile } from "../utils/localStorageData";
import UploadItem from "../components/UploadItem";
import { UploadStatus } from "@shared/schema";
import { ArrowLeft, RefreshCcwDot } from "lucide-react";
import { Link } from "react-router-dom";

interface HistoryListProps {
  refresh: boolean;
}

const HistoryList: React.FC<HistoryListProps> = ({ refresh }) => {
  const [files, setFiles] = useState<HistoryFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefresh, setIsRefresh] = useState(true);
  const [showMoreHistory, setShowMoreHistory] = useState(false);
  useEffect(() => {
    setIsRefresh(!isRefresh);
  }, [refresh]);

  const showMorehistory = () => {
    setShowMoreHistory(true);
    console.log("showMorehistory");
  };

  useEffect(() => {
    const loadFiles = async () => {
      try {
        const historyFiles = await getHistoryFiles();
        const sortedFiles = historyFiles.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA;
        });
        setFiles(sortedFiles);
      } catch (error) {
        console.error("Error loading history files:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFiles();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  const limit = showMoreHistory ? files.length : 3;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-0 pt-0">
      {files.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No files found in your space.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 ">
          {/* 如果 showMoreHistory 为 true，显示所有文件，否则只显示前 10 个文件 */}
          {files.slice(0, limit).map((file) => (
            <UploadItem
              key={file.id}
              upload={{
                id: String(file.id || 0),
                fileName: file.fileName,
                fileSize: file.fileSize,
                progress: file.progress,
                status: file.status as UploadStatus["status"],
                cid: file.cid || null,
                shareableLink: file.shareableLink || null,
                errorMessage: file.errorMessage || null,
                createdAt: file.createdAt || null,
              }}
              onRetry={() => {}}
              onCopy={() => {}}
            />
          ))}
          {!showMoreHistory && files.length > limit && (
            <div className="flex justify-center">
              <div
                onClick={() => {
                  showMorehistory();
                }}
                className="text-blue-600 underline hover:text-blue-800 transition-colors duration-200"
              >
                More History
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoryList;
