"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface City {
  name: string;
  lat: number;
  lng: number;
}

const cities: City[] = [
  { name: "Madrid", lat: 40.4168, lng: -3.7038 },
  { name: "Barcelona", lat: 41.3851, lng: 2.1734 },
  { name: "Valencia", lat: 39.4699, lng: -0.3763 },
  { name: "Sevilla", lat: 37.3886, lng: -5.9823 },
  { name: "Zaragoza", lat: 41.6488, lng: -0.8891 },
  { name: "Málaga", lat: 36.7213, lng: -4.4213 },
  { name: "Murcia", lat: 37.9922, lng: -1.1307 },
  { name: "Palma", lat: 39.5696, lng: 2.6502 },
  { name: "Las Palmas", lat: 28.1248, lng: -15.43 },
  { name: "Bilbao", lat: 43.263, lng: -2.935 },
];

export default function Home() {
  const router = useRouter();

  const handleCityClick = (city: City) => {
    router.push(
      `/map?lat=${city.lat}&lng=${city.lng}&city=${encodeURIComponent(
        city.name
      )}`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/50 to-orange-50/80">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Explora ciudades de una forma distinta
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Encuentra puntos de interés únicos diferentes de los típicos
            turísticos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {cities.map((city) => (
            <Button
              key={city.name}
              onClick={() => handleCityClick(city)}
              variant="outline"
              className="h-20 text-lg font-semibold bg-white hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {city.name}
            </Button>
          ))}
        </div>
      </main>
    </div>
  );
}
