import Vote from "@/models/vote";
import { connectToMongo } from "@/utils/database/mongodb/mongo";
import { auth } from "@/utils/auth";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest): Promise<Response> => {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    await connectToMongo();
    const { pointId, score } = await request.json();

    if (typeof score !== "number" || !pointId) {
      return new Response("Missing or invalid fields", { status: 400 });
    }

    const newVote = new Vote({
      userId: session.user.id,
      pointId,
      score,
    });

    await newVote.save();
    return new Response(JSON.stringify(newVote), { status: 201 });
  } catch (error) {
    console.error("Error creating vote:", error);
    return new Response("Failed to create vote", { status: 500 });
  }
};
