"use client";

import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import MapClickHandler from "./MapClickHandler";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

function PointsLayer() {
  const [points, setPoints] = useState<any[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<any | null>(null);
  const [popupPos, setPopupPos] = useState<[number, number] | null>(null);

  const fetchPoints = async (center: L.LatLng, radius: number) => {
    const res = await fetch(
      `/api/points/near?latitude=${center.lat}&longitude=${center.lng}&radius=${radius}`
    );
    const data = await res.json();
    setPoints(data);
  };

  // Calcula el radio visible del mapa en metros (aprox)
  const getRadius = (map: L.Map) => {
    const bounds = map.getBounds();
    const center = map.getCenter();
    const north = bounds.getNorth();
    // Distancia del centro al norte del mapa
    return map.distance(center, L.latLng(north, center.lng));
  };

  useMapEvents({
    moveend: (e) => {
      const map = e.target;
      const center = map.getCenter();
      const radius = getRadius(map);
      fetchPoints(center, radius);
    },
    // Carga inicial
    load: (e) => {
      const map = e.target;
      const center = map.getCenter();
      const radius = getRadius(map);
      fetchPoints(center, radius);
    },
  });

  // Cargar detalles al hacer click en un marcador
  const handleMarkerClick = async (point: any) => {
    const res = await fetch(`/api/points/${point._id}`);
    const data = await res.json();
    setSelectedPoint(data);
    setPopupPos([point.location.coordinates[1], point.location.coordinates[0]]);
  };

  return (
    <>
      {points.map((point) => (
        <Marker
          key={point._id}
          position={[
            point.location.coordinates[1],
            point.location.coordinates[0],
          ]}
          eventHandlers={{
            click: () => handleMarkerClick(point),
          }}
        />
      ))}
      {selectedPoint && popupPos && (
        <Popup
          position={popupPos}
          eventHandlers={{
            remove: () => setSelectedPoint(null),
          }}
        >
          <div>
            <strong>{selectedPoint.name}</strong>
            <p>{selectedPoint.description}</p>
            <p>
              <b>Categoría:</b> {selectedPoint.category}
            </p>
            <p>
              <b>Autor:</b> {selectedPoint.author}
            </p>
          </div>
        </Popup>
      )}
    </>
  );
}

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
        <PointsLayer />
        <MapClickHandler />
      </MapContainer>
    </div>
  );
}
