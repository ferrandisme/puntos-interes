import Point from "@/models/point";
import { connectToMongo } from "@/utils/database/mongodb/mongo";
import { NextRequest } from "next/server";

// Ej: /api/points?latitude=40.4168&longitude=-3.7038&radius=1000

export const GET = async (request: NextRequest): Promise<Response> => {
  try {
    await connectToMongo();

    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get("latitude") || "");
    const lng = parseFloat(searchParams.get("longitude") || "");
    const radius = parseFloat(searchParams.get("radius") || ""); // en metros

    let points;

    if (!isNaN(lat) && !isNaN(lng) && !isNaN(radius)) {
      points = await Point.find(
        {
          location: {
            $near: {
              $geometry: { type: "Point", coordinates: [lng, lat] },
              $maxDistance: radius,
            },
          },
        },
        "_id name location"
      );
    } else {
      points = await Point.find({}, "_id name location");
    }

    return new Response(JSON.stringify(points), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch points", { status: 500 });
  }
};
