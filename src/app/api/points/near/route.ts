import Point from "@/models/point";
import { connectToMongo } from "@/utils/database/mongodb/mongo";
import { NextRequest } from "next/server";
import { FilterQuery } from "mongoose";
import { IPoint } from "@/models/point";

// Ej: /api/points/near?latitude=40.4168&longitude=-3.7038&radius=1000&categories=cat1,cat2&minRating=3

export const GET = async (request: NextRequest): Promise<Response> => {
  try {
    await connectToMongo();

    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get("latitude") || "");
    const lng = parseFloat(searchParams.get("longitude") || "");
    const radius = parseFloat(searchParams.get("radius") || ""); // en metros
    const categoriesParam = searchParams.get("categories");
    const minRatingParam = searchParams.get("minRating");

    // Build the query object
    const query: FilterQuery<IPoint> = {};

    // Add location filter if coordinates are provided
    if (!isNaN(lat) && !isNaN(lng) && !isNaN(radius)) {
      query.location = {
        $near: {
          $geometry: { type: "Point", coordinates: [lng, lat] },
          $maxDistance: radius,
        },
      };
    }

    // Add category filter if provided
    if (categoriesParam) {
      const categories = categoriesParam.split(",").filter(Boolean);
      if (categories.length > 0) {
        query.category = { $in: categories };
      }
    }

    // Add rating filter if provided
    if (minRatingParam) {
      const minRating = parseFloat(minRatingParam);
      if (!isNaN(minRating)) {
        query.rating = { $gte: minRating };
      }
    }

    const points = await Point.find(
      query,
      "_id name location category rating"
    ).populate("category", "name");

    return new Response(JSON.stringify(points), { status: 200 });
  } catch (error) {
    console.error("Error fetching points:", error);
    return new Response("Failed to fetch points", { status: 500 });
  }
};
