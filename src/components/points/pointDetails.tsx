"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
//import { Rating, RatingButton } from '@/components/ui/shadcn-io/rating';

import { useEffect, useState } from "react";
import { Point } from "@/types";

export default function PointDetails(id: any) {
  const [point, setPoint] = useState<Point>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPoint = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/points/" + id.id);
        const data = await response.json();
        setPoint(data);
      } catch (error) {
        console.error("Error fetching point:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPoint();
  }, [id.id]);

  return (
    <Card className="w-[350px]">
      {loading ? (
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
            <p>Cargando...</p>
          </div>
        </CardContent>
      ) : (
        <>
          <CardHeader style={{ fontSize: "24px" }}>
            <CardTitle>{point?.name}</CardTitle>
          </CardHeader>
          <CardHeader
            style={{
              fontSize: "16px",
              textTransform: "uppercase",
              textAlign: "right",
            }}
          >
            {point?.category}
          </CardHeader>
          {/* <CardDescription >{point?.author}</CardDescription> */}
          <CardContent>{point?.description}</CardContent>
        </>
      )}
    </Card>
  );
}
