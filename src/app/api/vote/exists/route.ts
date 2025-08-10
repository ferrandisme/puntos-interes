import Vote from "@/models/vote";
import { connectToMongo } from "@/utils/database/mongodb/mongo";
import { auth } from "@/utils/auth";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest): Promise<Response> => {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    await connectToMongo();
    const { searchParams } = new URL(request.url);
    const pointId = searchParams.get("pointId");

    if (!pointId) {
      return new Response("Point ID is required", { status: 400 });
    }

    const existingVote = await Vote.findOne({
      userId: session.user.id,
      pointId,
    });

    return new Response(
      JSON.stringify({
        exists: !!existingVote,
        vote: existingVote || null,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking vote existence:", error);
    return new Response("Failed to check vote", { status: 500 });
  }
};
