import { useParams } from "react-router-dom";
import { useState } from "react";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

const Project = () => {
  const { id } = useParams<{ id: string }>();
  const [filesData, setFilesData] = useState<any>(null);
  const [fetchingFiles, setFetchingFiles] = useState(false);
  const [error, setError] = useState<string>("");

  // Fetch project files
  const fetchProjectFiles = async () => {
    if (!id) return;
    setFetchingFiles(true);
    try {
      const response = await fetch(`${SERVER_URL}/project/getAllFiles/${id}`, {
        credentials: "include",
      });
      const data = await response.json();
      setFilesData(data);
    } catch (err) {
      setError("Failed to fetch project files");
    } finally {
      setFetchingFiles(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Project Debug Page</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Files Data */}
        <div>
          <h2 className="text-xl font-semibold mb-3">
            Project Files (/getAllFiles)
            <button
              onClick={fetchProjectFiles}
              disabled={fetchingFiles}
              className="ml-3 px-3 py-1 bg-blue-500 text-white rounded text-sm disabled:opacity-50">
              {fetchingFiles ? "Fetching..." : "Fetch Files"}
            </button>
          </h2>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-auto max-h-96">
            <pre className="text-sm whitespace-pre-wrap">
              {filesData ? JSON.stringify(filesData, null, 2) : "Click 'Fetch Files' to load"}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Project;
