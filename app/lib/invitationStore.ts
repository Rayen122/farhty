"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Template } from "../templates/data";

/** Contenu éditable d'une invitation — même forme que `Template["previewText"]` */
export type InvitationDraft = Template["previewText"];

export const EMPTY_STORY = { title: "", text: "" };
export const EMPTY_PROGRAM = { time: "", title: "", desc: "" };

export interface InvitationGeo {
  lat: number;
  lng: number;
  address?: string;
}

/** Position d'un bloc sur la carte, en % de la carte (centre du bloc) */
export interface BlockPosition {
  x: number;
  y: number;
}
export type CardLayout = Record<string, BlockPosition>;

/** Formules — le libellé et le prix affichés ; le montant qui fait foi est calculé par le serveur */
export const PLAN_OPTIONS = [
  { id: "elegante", label: "الأنيقة", amountDT: 49 },
  { id: "diamant", label: "الماسية", amountDT: 89 },
  { id: "royale", label: "رويال", amountDT: 149 },
] as const;
export type PlanId = (typeof PLAN_OPTIONS)[number]["id"];

/** Placement par défaut des blocs de la carte, si l'utilisateur n'a rien déplacé */
export const DEFAULT_CARD_LAYOUT: CardLayout = {
  label: { x: 50, y: 36 },
  names: { x: 50, y: 47 },
  rule: { x: 50, y: 58 },
  date: { x: 50, y: 64 },
  venue: { x: 50, y: 68 },
};

interface InvitationState {
  /** Modèle choisi (slug). `null` tant que l'utilisateur n'a rien choisi. */
  slug: string | null;
  draft: InvitationDraft | null;
  /** Point GPS exact de la salle — prioritaire sur le texte lieu + ville */
  geo: InvitationGeo | null;
  setGeo: (geo: InvitationGeo | null) => void;
  /** Positions personnalisées des blocs sur la carte */
  layout: CardLayout | null;
  plan: PlanId;
  setPlan: (plan: PlanId) => void;
  setBlockPosition: (id: string, pos: BlockPosition) => void;
  resetLayout: () => void;
  setSlug: (slug: string) => void;
  /** Initialise le brouillon à partir du contenu de démo du modèle */
  initFrom: (slug: string, previewText: InvitationDraft) => void;
  setField: <K extends keyof InvitationDraft>(key: K, value: InvitationDraft[K]) => void;
  updateStory: (index: number, patch: Partial<{ title: string; text: string }>) => void;
  addStory: () => void;
  removeStory: (index: number) => void;
  updateProgram: (index: number, patch: Partial<{ time: string; title: string; desc: string }>) => void;
  addProgram: () => void;
  removeProgram: (index: number) => void;
  addPhoto: (url: string) => void;
  removePhoto: (index: number) => void;
  setMusic: (url?: string, title?: string) => void;
  reset: () => void;
}

export const useInvitationStore = create<InvitationState>()(
  persist(
    (set) => ({
      slug: null,
      draft: null,
      geo: null,
      layout: null,
      plan: "elegante",

      setSlug: (slug) => set({ slug }),
      setPlan: (plan) => set({ plan }),
      setGeo: (geo) => set({ geo }),

      setBlockPosition: (id, pos) =>
        set((state) => ({ layout: { ...(state.layout ?? DEFAULT_CARD_LAYOUT), [id]: pos } })),
      resetLayout: () => set({ layout: null }),

      initFrom: (slug, previewText) =>
        set({
          slug,
          // copie profonde : sinon on muterait les données de démo partagées
          draft: {
            ...previewText,
            story: previewText.story.map((s) => ({ ...s })),
            program: previewText.program.map((p) => ({ ...p })),
            photos: [...previewText.photos],
          },
        }),

      setField: (key, value) =>
        set((state) => (state.draft ? { draft: { ...state.draft, [key]: value } } : state)),

      updateStory: (index, patch) =>
        set((state) =>
          state.draft
            ? {
                draft: {
                  ...state.draft,
                  story: state.draft.story.map((s, i) => (i === index ? { ...s, ...patch } : s)),
                },
              }
            : state
        ),

      addStory: () =>
        set((state) =>
          state.draft ? { draft: { ...state.draft, story: [...state.draft.story, { ...EMPTY_STORY }] } } : state
        ),

      removeStory: (index) =>
        set((state) =>
          state.draft
            ? { draft: { ...state.draft, story: state.draft.story.filter((_, i) => i !== index) } }
            : state
        ),

      updateProgram: (index, patch) =>
        set((state) =>
          state.draft
            ? {
                draft: {
                  ...state.draft,
                  program: state.draft.program.map((p, i) => (i === index ? { ...p, ...patch } : p)),
                },
              }
            : state
        ),

      addProgram: () =>
        set((state) =>
          state.draft
            ? { draft: { ...state.draft, program: [...state.draft.program, { ...EMPTY_PROGRAM }] } }
            : state
        ),

      removeProgram: (index) =>
        set((state) =>
          state.draft
            ? { draft: { ...state.draft, program: state.draft.program.filter((_, i) => i !== index) } }
            : state
        ),

      addPhoto: (url) =>
        set((state) =>
          state.draft
            ? { draft: { ...state.draft, photos: [...state.draft.photos, url] } }
            : state
        ),

      removePhoto: (index) =>
        set((state) =>
          state.draft
            ? { draft: { ...state.draft, photos: state.draft.photos.filter((_, i) => i !== index) } }
            : state
        ),

      setMusic: (url, title) =>
        set((state) => ({
          draft: state.draft
            ? { ...state.draft, musicUrl: url, musicTitle: title }
            : ({ musicUrl: url, musicTitle: title } as any),
        })),

      reset: () => set({ slug: null, draft: null, geo: null, layout: null, plan: "elegante" }),
    }),
    { name: "farhty-invitation-draft" }
  )
);

/**
 * L'aperçu vit dans une iframe : c'est un autre document, donc un autre store.
 * L'événement `storage` ne se déclenche que dans les AUTRES documents de la même
 * origine — exactement ce qu'il faut pour répercuter les frappes du parent.
 */
export function subscribeToDraftAcrossFrames(): () => void {
  if (typeof window === "undefined") return () => {};
  const onStorage = (e: StorageEvent) => {
    if (e.key === "farhty-invitation-draft") {
      useInvitationStore.persist.rehydrate();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => window.removeEventListener("storage", onStorage);
}
