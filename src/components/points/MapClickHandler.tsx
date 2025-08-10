"use client";

import { useMapEvents } from "react-leaflet";

export default function MapClickHandler() {
  useMapEvents({
    click: (e) => {
      // Mostrar alert con las coordenadas del click
      alert(
        `Has hecho click en el mapa en: ${e.latlng.lat.toFixed(
          6
        )}, ${e.latlng.lng.toFixed(6)}`
      );
    },
  });

  return null;
}
