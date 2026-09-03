import type { Metadata } from "next";
import { Suspense } from "react";
import CheckinScanner from "./CheckinScanner";

export const metadata: Metadata = {
  title: "استقبال الضيوف",
  robots: { index: false, follow: false },
};

export default function ScanPage() {
  return (
    <Suspense fallback={null}>
      <CheckinScanner />
    </Suspense>
  );
}
