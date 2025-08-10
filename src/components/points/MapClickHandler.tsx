"use client";

import { useState } from "react";
import { useMapEvents } from "react-leaflet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSession } from "@/utils/auth-client";

export default function MapClickHandler() {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const { data, isPending, error } = useSession();

  useMapEvents({
    click: (e) => {
      if (!data || !data.user) {
        alert("Debes iniciar sesión para añadir un punto de interés.");
        return;
      }
      setCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
      setOpen(true);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coords || !data?.user) return;
    setLoading(true);
    await fetch("/api/points", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        latitude: coords.lat,
        longitude: coords.lng,
        ...form,
      }),
    });
    setLoading(false);
    setOpen(false);
    setForm({ name: "", description: "", category: "" });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo Punto de Interés</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <Label>Nombre</Label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label>Descripción</Label>
            <Input
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label>Categoría</Label>
            <Input
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
