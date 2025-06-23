import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import CodePreview from "./CodePreview";
import PromptLog from "./PromptLog";
import { Globe, Code2 } from "lucide-react";

// Persistent socket
const socket = io("http://localhost:3000", {
  transports: ["websocket"],
  reconnectionAttempts: 5,
  timeout: 10000,
});

export default function GenerationView({ profile }) {
  const [html, setHtml] = useState("");
  const [log, setLog] = useState([]);
  const [view, setView] = useState("preview");

  useEffect(() => {
    if (!profile) return;

    socket.emit("generate", profile);

    const handleGeneratedCode = (data) => {
      setHtml(data.html);
      setLog((prev) => [
        ...prev,
        { text: data.prompt, timestamp: new Date().toISOString() },
      ]);
    };

    socket.on("generatedCode", handleGeneratedCode);

    return () => {
      socket.off("generatedCode", handleGeneratedCode);
    };
  }, [profile]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-white to-indigo-100 text-gray-900 overflow-hidden">
      {/* Sidebar */}
      <PromptLog log={log} />

      {/* Main Panel */}
      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-700">🛠️ Generation View</h2>
          <div className="flex space-x-3">
            {["preview", "code"].map((type) => (
              <button
                key={type}
                onClick={() => setView(type)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  view === type
                    ? "bg-blue-600 text-white shadow"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                {type === "preview" ? <Globe size={16} /> : <Code2 size={16} />}
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content Display */}
        <div className="flex-1 overflow-hidden p-4">
          <div className="w-full h-full bg-white border rounded-xl shadow-xl overflow-hidden">
            {view === "preview" ? (
              <iframe
                srcDoc={html || "<h2>Waiting for preview...</h2>"}
                title="Live Preview"
                className="w-full h-full rounded-xl"
                sandbox="allow-same-origin allow-scripts"
              />
            ) : (
              <CodePreview code={html || "<!-- No code generated -->"} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
