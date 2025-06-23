import { useState } from "react";
import Editor from "@monaco-editor/react";
import { ClipboardCopy, Download, Check } from "lucide-react";

export default function CodePreview({ code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "landing-page.html";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full rounded-xl overflow-hidden border bg-gray-900 shadow-lg relative">
      {/* Action Buttons */}
      <div className="absolute top-3 right-3 z-10 flex gap-2">
        <button
          onClick={handleCopy}
          className="group relative bg-indigo-600 hover:bg-indigo-700 transition text-white px-3 py-1 rounded-md flex items-center gap-1 text-xs font-medium shadow"
        >
          {copied ? (
            <>
              <Check size={14} />
              Copied
            </>
          ) : (
            <>
              <ClipboardCopy size={14} />
              Copy
            </>
          )}
          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] bg-black text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition">
            Copy to clipboard
          </span>
        </button>

        <button
          onClick={handleDownload}
          className="group relative bg-blue-600 hover:bg-blue-700 transition text-white px-3 py-1 rounded-md flex items-center gap-1 text-xs font-medium shadow"
        >
          <Download size={14} />
          Download
          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] bg-black text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition">
            Download HTML
          </span>
        </button>
      </div>

      {/* Code Editor */}
      <Editor
        height="100%"
        defaultLanguage="html"
        value={code}
        theme="vs-dark"
        options={{
          readOnly: true,
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: "on",
          lineNumbers: "on",
        }}
      />
    </div>
  );
}
