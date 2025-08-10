import Point from "@/models/point";
import { connectToMongo } from "@/utils/database/mongodb/mongo";
import { auth } from "@/utils/auth";
import { NextRequest } from "next/server";

export const GET = async (): Promise<Response> => {
  try {
    await connectToMongo();
    // Solo selecciona _id, name, latitude y longitude
    const points = await Point.find({}, "_id name latitude longitude");
    return new Response(JSON.stringify(points), { status: 200 });
  } catch (error) {
    console.error("Error fetching points:", error);
    return new Response("Failed to fetch points", { status: 500 });
  }
};

export const POST = async (request: NextRequest): Promise<Response> => {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    await connectToMongo();
    const { latitude, longitude, name, description, category } =
      await request.json();

    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number" ||
      !name ||
      !description ||
      !category
    ) {
      return new Response("Missing or invalid fields", { status: 400 });
    }

    const newPoint = new Point({
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      name,
      description,
      author: session.user.id,
      category,
    });

    await newPoint.save();
    return new Response(JSON.stringify(newPoint), { status: 201 });
  } catch (error) {
    console.error("Error creating point:", error);
    return new Response("Failed to create point", { status: 500 });
  }
};
