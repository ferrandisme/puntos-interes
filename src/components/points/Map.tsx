"use client";

import React, { useState, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import MapClickHandler from "./MapClickHandler";
import PointDetails from "./PointDetails";
import MapFiltersComponent, { MapFilters } from "./MapFilters";
import { createCustomMarkerIcon } from "@/utils/map-markers";
import { Point } from "@/types";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

function PointsLayer({
  refreshTrigger,
  position,
  filters,
}: {
  refreshTrigger: number;
  position: [number, number];
  filters: MapFilters;
}) {
  const [points, setPoints] = useState<Point[]>([]);
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
  const [popupPos, setPopupPos] = useState<[number, number] | null>(null);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

  const fetchPoints = useCallback(
    async (center: L.LatLng, radius: number) => {
      try {
        const searchParams = new URLSearchParams({
          latitude: center.lat.toString(),
          longitude: center.lng.toString(),
          radius: radius.toString(),
        });

        // Add category filters
        if (filters.categories.length > 0) {
          searchParams.set("categories", filters.categories.join(","));
        }

        // Add rating filter
        if (filters.minRating !== null) {
          searchParams.set("minRating", filters.minRating.toString());
        }

        const res = await fetch(`/api/points/near?${searchParams.toString()}`);
        const data = await res.json();
        setPoints(data);
      } catch (error) {
        console.error("Error fetching points:", error);
      }
    },
    [filters]
  );

  // Función para refrescar los puntos del área visible actual
  const refreshPoints = useCallback(() => {
    if (mapInstance) {
      const center = mapInstance.getCenter();
      const radius = getRadius(mapInstance);
      fetchPoints(center, radius);
    }
  }, [mapInstance, fetchPoints]);

  // Refrescar cuando cambie el trigger
  React.useEffect(() => {
    if (refreshTrigger > 0) {
      refreshPoints();
    }
  }, [refreshTrigger, refreshPoints]);

  // Refrescar cuando cambien los filtros
  React.useEffect(() => {
    if (mapInstance) {
      const center = mapInstance.getCenter();
      const radius = getRadius(mapInstance);
      fetchPoints(center, radius);
    }
  }, [filters, mapInstance, fetchPoints]);

  // Cargar puntos cuando cambie la posición inicial del mapa
  React.useEffect(() => {
    if (mapInstance && position) {
      const center = L.latLng(position[0], position[1]);
      const radius = getRadius(mapInstance);
      fetchPoints(center, radius);
    }
  }, [position, mapInstance, fetchPoints]);

  // Calcula el radio visible del mapa en metros (aprox)
  const getRadius = (map: L.Map) => {
    const bounds = map.getBounds();
    const center = map.getCenter();
    const corners = [
      bounds.getNorthEast(),
      bounds.getNorthWest(),
      bounds.getSouthEast(),
      bounds.getSouthWest(),
    ];

    const maxDistance = Math.max(
      ...corners.map((corner) => map.distance(center, corner))
    );

    return maxDistance;
  };

  const map = useMapEvents({
    moveend: (e) => {
      const map = e.target;
      setMapInstance(map);
      const center = map.getCenter();
      const radius = getRadius(map);
      fetchPoints(center, radius);
    },
    zoomend: (e) => {
      const map = e.target;
      const center = map.getCenter();
      const radius = getRadius(map);
      fetchPoints(center, radius);
    },
  });

  // Efecto para cargar puntos cuando el mapa y la instancia estén listos
  React.useEffect(() => {
    if (map && !mapInstance) {
      setMapInstance(map);
      const center = map.getCenter();
      const radius = getRadius(map);
      fetchPoints(center, radius);
    }
  }, [map, mapInstance, fetchPoints]);

  // Cargar detalles al hacer click en un marcador
  const handleMarkerClick = (point: Point) => {
    setSelectedPointId(point._id);
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
          icon={createCustomMarkerIcon(
            point.category?._id,
            point.category?.name,
            point.rating
          )}
          eventHandlers={{
            click: () => handleMarkerClick(point),
          }}
        />
      ))}
      {selectedPointId && popupPos && (
        <Popup
          position={popupPos}
          eventHandlers={{
            remove: () => setSelectedPointId(null),
          }}
        >
          <PointDetails id={selectedPointId} />
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
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [filters, setFilters] = useState<MapFilters>({
    categories: [],
    minRating: null,
  });

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleFiltersChange = (newFilters: MapFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={position}
        zoom={zoom}
        minZoom={10}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
        key={`${position[0]}-${position[1]}`} // Force render
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <PointsLayer
          refreshTrigger={refreshTrigger}
          position={position}
          filters={filters}
        />
        <MapClickHandler onPointCreated={triggerRefresh} />
      </MapContainer>
      <MapFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />
    </div>
  );
}
