"use client";

import React, { useEffect, useRef } from "react";
// @ts-ignore
import { mountScrollWorld } from "./scrub-engine.js";

export interface ScrubEngineProps {
  config: any;
}

export default function ScrubEngine({ config }: ScrubEngineProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clear container to avoid double mounting in React StrictMode
    containerRef.current.innerHTML = "";
    
    // Mount the scroll world
    mountScrollWorld(containerRef.current, config);
    
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [config]);

  return <div ref={containerRef} style={{ width: "100%", height: "100vh", position: "relative" }} />;
}
