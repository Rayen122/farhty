"use client";

import Link from "next/link";
import { ArrowLeft, Construction } from "lucide-react";

export default function EditorPage() {
  return (
    <main className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Construction size={40} className="text-gold" />
        </div>
        <h1 className="font-display text-3xl text-charcoal mb-3">Éditeur en construction</h1>
        <p className="text-charcoal/60 mb-8">
          Notre éditeur d'invitations interactif arrive très bientôt. En attendant, explorez nos modèles disponibles.
        </p>
        <Link href="/#modeles" className="inline-flex items-center gap-2 bg-charcoal text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-charcoal/90 transition-all">
          <ArrowLeft size={16} /> Retour aux modèles
        </Link>
      </div>
    </main>
  );
}
