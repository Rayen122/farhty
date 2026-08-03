"use client";

import React, { useEffect } from "react";

export default function TemplateErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[TemplateErrorBoundary]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black text-red-400 p-4 font-mono text-xs overflow-auto flex flex-col items-center justify-center text-center">
      <div className="bg-red-950/80 border border-red-500/50 p-4 rounded-xl max-w-md shadow-2xl">
        <h2 className="text-sm font-bold text-red-200 mb-2">⚠ Erreur de rendu dans l'invitation</h2>
        <p className="text-red-300 font-semibold mb-3">{error.message || "Erreur inconnue"}</p>
        <pre className="text-[10px] text-red-400/80 bg-black/60 p-2 rounded max-h-40 overflow-auto text-left mb-4">
          {error.stack}
        </pre>
        <button
          onClick={() => reset()}
          className="px-3 py-1.5 bg-red-800 text-white rounded-lg font-sans font-bold hover:bg-red-700 transition-all cursor-pointer"
        >
          Réessayer (Reset)
        </button>
      </div>
    </div>
  );
}
