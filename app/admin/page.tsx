"use client";

import dynamic from "next/dynamic";

/* Rendu client uniquement : le panneau lit sessionStorage dès son premier rendu,
   ce qui provoquerait un écart avec le HTML serveur. */
const AdminPanel = dynamic(() => import("./AdminPanel"), {
  ssr: false,
  loading: () => <main className="min-h-screen bg-[#0F0206]" />,
});

export default function AdminPage() {
  return <AdminPanel />;
}
