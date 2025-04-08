import React, { useEffect, useState } from "react";
import { getHistoryFiles, HistoryFile } from "../utils/localStorageData";
import UploadItem from "../components/UploadItem";
import { UploadStatus } from "@shared/schema";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const MySpace: React.FC = () => {
  const [files, setFiles] = useState<HistoryFile[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link
          to="/"
          className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold">My Space</h1>
      </div>
      {files.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No files found in your space.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 ">
          {files.map((file) => (
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
        </div>
      )}
    </div>
  );
};

export default MySpace;
