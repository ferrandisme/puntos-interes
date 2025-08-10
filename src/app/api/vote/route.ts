import Vote from "@/models/vote";
import { connectToMongo } from "@/utils/database/mongodb/mongo";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest): Promise<Response> => {
  try {
    await connectToMongo();
    const { userId, pointId, score } = await request.json();

    if (
      typeof score !== "number" ||
      !userId ||
      !pointId
    ) {
      return new Response("Missing or invalid fields", { status: 400 });
    }

    const newVote = new Vote({
      userId,
      pointId,
      score
    });

    await newVote.save();
    return new Response(JSON.stringify(newVote), { status: 201 });
  } catch (error) {
    return new Response("Failed to create vote", { status: 500 });
  }
};
