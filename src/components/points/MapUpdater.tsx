"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";

interface MapUpdaterProps {
  center: [number, number];
  zoom: number;
}

export default function MapUpdater({ center, zoom }: MapUpdaterProps) {
  const map = useMap();

  useEffect(() => {
    if (map && center) {
      map.setView(center, zoom, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [map, center, zoom]);

  return null;
}
