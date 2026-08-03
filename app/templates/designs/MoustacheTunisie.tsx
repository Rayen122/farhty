"use client";

import React from "react";
import ScrubEngine from "./ScrubEngine";

export default function MoustacheTunisie() {
  const config = {
    brand: { name: 'Moustache Tunisie', href: '#' },
    diveScroll: 1.5,
    connScroll: 0.9,
    hint: 'Défilez pour explorer',
    nav: true,
    atmosphere: true,
    sections: [
      {
        id: 'atelier',
        label: "L'Atelier",
        // Using mp4 as placeholder poster since webp failed, or we can just omit it and it will be black.
        // Let's use a dummy solid color or just let it be empty so we see the video immediately
        still: '',
        clip: '/assets/moustache/clip_1.mp4',
        accent: '#D4AF37', // Gold
        scroll: 1.6,
        linger: 0.5,
        eyebrow: 'La Création',
        title: 'L\'Art de S\'habiller.',
        body: 'Découvrez notre atelier où chaque fil raconte une histoire d\'élégance et de précision. by Firas Kchaou.',
        tags: ['Sur-mesure', 'Haute Couture']
      },
      {
        id: 'collection-noire',
        label: 'Collection Noire',
        still: '',
        clip: '/assets/moustache/clip_2.mp4',
        accent: '#2c2c2c', // Dark gray
        scroll: 1.5,
        linger: 0.4,
        eyebrow: 'Le Classique',
        title: 'Le Smoking Noir.',
        body: 'Intemporel, audacieux, parfait. L\'élégance à l\'état pur pour vos soirées inoubliables.',
        tags: ['Smoking Noir', 'Élégance']
      },
      {
        id: 'collection-bleue',
        label: 'Collection Bleue',
        still: '',
        clip: '/assets/moustache/clip_3.mp4',
        accent: '#1e3a5f', // Deep blue
        scroll: 1.5,
        linger: 0.4,
        eyebrow: 'L\'Audace',
        title: 'Nuances de Bleu.',
        body: 'Démarquez-vous avec nos créations en bleu profond. Un style affirmé pour les hommes de goût.',
        tags: ['Smoking Bleu', 'Moderne']
      },
      {
        id: 'ceremonies',
        label: 'Cérémonies',
        still: '',
        clip: '/assets/moustache/clip_4.mp4',
        accent: '#e6d5c3', // Beige/Champagne
        scroll: 1.5,
        linger: 0.4,
        eyebrow: 'Le Grand Jour',
        title: 'Pour l\'Éternité.',
        body: 'Accompagnez vos plus beaux moments avec un costume conçu pour sublimer votre couple.',
        tags: ['Mariage', 'Couples']
      },
      {
        id: 'essayage',
        label: 'Contact',
        still: '',
        clip: '/assets/moustache/clip_5.mp4',
        accent: '#D4AF37', // Gold
        scroll: 1.8,
        linger: 0.6,
        eyebrow: 'Votre Tour',
        title: 'Prenez Rendez-vous.',
        body: 'Appelez le (+216) 29 419 419 pour planifier votre essayage privé.',
        tags: ['Boutique', 'Tunisie'],
        cta: {
          primary: { label: 'Nous Contacter', href: 'tel:+21629419419' },
          secondary: { label: 'Voir Instagram', href: 'https://instagram.com/moustache_tunisie' }
        }
      }
    ]
    // Note: No connectors array means it will just crossfade between the clips
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .sw-root {
          --sw-bg: #111111;
          --sw-ink: #ffffff;
          --sw-ink-soft: #a0a0a0;
          --sw-accent: #D4AF37;
          --sw-font-display: 'Inter', system-ui, sans-serif;
          --sw-font-body: 'Inter', system-ui, sans-serif;
        }
      `}} />
      <ScrubEngine config={config} />
    </>
  );
}
