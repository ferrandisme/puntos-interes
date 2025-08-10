"use client";
import dynamic from "next/dynamic";
import PointDetails from "@/components/points/pointDetails";

const Map = dynamic(() => import("@/components/points/map"), {
  ssr: false,
});
//import Map from "../components/points/map";

export default function DetailTest() {
 const ids = '689877cb46ede634dbe799b5';
  
 return (
    <div>
      <PointDetails id={ids}/>
    </div>
 )

 
 PointDetails({ids});
}
