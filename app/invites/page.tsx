import type { Metadata } from "next";
import { Suspense } from "react";
import InvitesManager from "./InvitesManager";

export const metadata: Metadata = {
  title: "قائمة المدعوين",
  /* Écran privé, accessible par jeton : rien à faire dans un moteur de recherche */
  robots: { index: false, follow: false },
};

export default function InvitesPage() {
  return (
    <Suspense fallback={null}>
      <InvitesManager />
    </Suspense>
  );
}
