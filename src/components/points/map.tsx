'use client'

import React from 'react'
import { MapContainer, Marker, TileLayer, Tooltip } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"

export default function Map(props: any) {
  const { position, zoom } = props

  return <div>
    <MapContainer center={position} zoom={zoom} scrollWheelZoom={true} style={{ height: "800px", width: "200px" }} >
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
      <Marker position={position}>
        <Tooltip>Punto de ejemplo Londres</Tooltip>
      </Marker>
  </MapContainer>
  </div>
}