export default function PromptLog({ log }) {
  return (
    <aside className="w-80 max-w-[30%] backdrop-blur-md bg-white/80 border-r border-gray-200 p-5 overflow-y-auto hidden md:block shadow-inner">
      <h2 className="text-lg font-semibold mb-4 text-purple-700 tracking-wide flex items-center gap-1">
        🧠 Prompt Log
      </h2>

      {log.length === 0 ? (
        <p className="text-sm text-gray-500">No prompts yet</p>
      ) : (
        log.map((entry, idx) => (
          <div
            key={idx}
            className="mb-4 p-3 rounded-lg bg-indigo-50/60 border-l-4 border-indigo-500 shadow-sm hover:bg-indigo-100 transition"
          >
            <div className="text-xs text-gray-400 mb-1">
              {new Date(entry.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div className="text-sm text-gray-700 whitespace-pre-wrap">
              {entry.text}
            </div>
          </div>
        ))
      )}
    </aside>
  );
}
