import Category from "@/models/category";
import { connectToMongo } from "@/utils/database/mongodb/mongo";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest): Promise<Response> => {
  try {
    await connectToMongo();
    const categories = await Category.find({});
    return new Response(JSON.stringify(categories), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch categories", { status: 500 });
  }
};
