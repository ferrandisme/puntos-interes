"use client";
import dynamic from "next/dynamic";
import { useMemo } from "react";

const Map = dynamic(() => import("../../components/points/map"), {
  ssr: false,
});
//import Map from "../components/points/map";

export default function Home() {
  const Map = useMemo(
    () =>
      dynamic(() => import("../../components/points/map"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  const coords = [51.505, -0.09];
  const zoom = 19;

  return (
    <div className="w-full h-screen">
      <Map position={coords} zoom={zoom}></Map>
    </div>
  );
}
