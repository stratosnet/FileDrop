import { AlertCircle } from "lucide-react";

export default function InfoAlert() {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded mb-8" role="alert">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 mt-0.5" />
        </div>
        <div className="ml-3">
          <p className="text-sm">
            Files are stored on the decentralized Stratos SPFS network and are accessible via the provided link. 
            No account needed. Files are identified only by their Content Identifier (CID).
          </p>
        </div>
      </div>
    </div>
  );
}
