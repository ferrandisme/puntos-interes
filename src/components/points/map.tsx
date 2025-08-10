"use client";

import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import MapUpdater from "./MapUpdater";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

interface MapProps {
  position: [number, number];
  zoom: number;
}

export default function Map({ position, zoom }: MapProps) {
  return (
    <div className="w-full h-full">
      <MapContainer
        center={position}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
        key={`${position[0]}-${position[1]}`} // Force render
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={position} zoom={zoom} />
        {/*         <Marker position={position}>
          <Tooltip>Punto de ejemplo Londres</Tooltip>
        </Marker> */}
      </MapContainer>
    </div>
  );
}
