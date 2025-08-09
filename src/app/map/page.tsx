'use client'
import Image from "next/image";
import dynamic from 'next/dynamic';
import { useMemo } from 'react';

const Map = dynamic(() => import('../../components/points/map'), { ssr: false });
//import Map from "../components/points/map";

export default function Home() {
  const Map = useMemo(() => dynamic(
    () => import('../../components/points/map'),
    { 
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), [])
    
 const coords = [51.505, -0.09];
 const zoom = 19;

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <div>
        <Map position={coords} zoom={zoom}></Map>
      </div>
    </div>
  );
}
