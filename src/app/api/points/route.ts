import Point from "@/models/point";
import { connectToMongo } from "@/utils/database/mongodb/mongo";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) : Promise<Response> =>{
  try {
    await connectToMongo();
    const points = await Point.find({});
    console.log("Points",points);
    return new Response(JSON.stringify(points), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to fecth point", { status: 500 });
  }
}
