"use client";
import { useEffect, useState } from "react";
import { Point } from "@/types";

interface PointDetailsProps {
  id: string;
}

export default function PointDetails({ id }: PointDetailsProps) {
  const [point, setPoint] = useState<Point>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPoint = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/points/" + id);
        const data = await response.json();
        setPoint(data);
      } catch (error) {
        console.error("Error fetching point:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPoint();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4 min-w-[250px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-[250px] max-w-[300px] p-2">
      <div className="mb-3">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{point?.name}</h3>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
            {point?.category}
          </span>
          {/* <span className="text-xs text-gray-500">Por: {point?.author}</span> */}
        </div>
      </div>

      {point?.description && (
        <div className="text-sm text-gray-700 leading-relaxed">
          {point.description}
        </div>
      )}
    </div>
  );
}
