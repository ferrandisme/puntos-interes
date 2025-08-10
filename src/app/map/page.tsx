"use client";
import dynamic from "next/dynamic";
import { useMemo, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function MapPageContent() {
  const searchParams = useSearchParams();
  const [mapConfig, setMapConfig] = useState({
    coords: [40.4168, -3.7038] as [number, number], // Default
    zoom: 14,
    cityName: "Madrid",
  });

  const MapComponent = useMemo(
    () =>
      dynamic(() => import("@/components/points/Map"), {
        loading: () => (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">
                Cargando mapa de {mapConfig.cityName}...
              </p>
            </div>
          </div>
        ),
        ssr: false,
      }),
    [mapConfig.cityName]
  );

  useEffect(() => {
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const city = searchParams.get("city");

    if (lat && lng) {
      setMapConfig({
        coords: [parseFloat(lat), parseFloat(lng)],
        zoom: 14,
        cityName: city || "Ciudad seleccionada",
      });
    }
  }, [searchParams]);

  return (
    <div className="w-full relative">
      <div className="absolute top-4 right-4 z-[60]">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg flex items-center space-x-3">
          <h1 className="text-lg font-semibold text-gray-900">
            {mapConfig.cityName}
          </h1>

          <button
            onClick={() => window.history.back()}
            className="bg-gray-100/80 hover:bg-gray-200 hover:shadow-md transition-all rounded-md p-2 group"
            aria-label="Volver al inicio"
            title="Volver al inicio"
          >
            <svg
              className="w-4 h-4 text-gray-700 group-hover:text-blue-600 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="w-full h-[calc(100vh-64px)]">
        <MapComponent position={mapConfig.coords} zoom={mapConfig.zoom} />
      </div>
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-[calc(100vh-64px)] flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando mapa...</p>
          </div>
        </div>
      }
    >
      <MapPageContent />
    </Suspense>
  );
}
