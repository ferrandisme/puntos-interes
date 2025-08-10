import Point from "@/models/point";
import { connectToMongo } from "@/utils/database/mongodb/mongo";
import { NextRequest } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: { categoryId: string } }
): Promise<Response> => {
  try {
    await connectToMongo();
    const points = await Point.find({category: params.categoryId});
    if (!points) {
      return new Response("Points not found", { status: 404 });
    }
    return new Response(JSON.stringify(points), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch points", { status: 500 });
  }
};
