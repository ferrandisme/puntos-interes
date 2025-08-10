import Vote from "@/models/vote";
import Point from "@/models/point";
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

    // Validar que el score esté entre 1 y 5
    if (score < 1 || score > 5) {
      return new Response("Score must be between 1 and 5", { status: 400 });
    }

    // Comprobar si el usuario ya ha votado en este punto
    const existingVote = await Vote.findOne({
      userId: session.user.id,
      pointId,
    });

    if (existingVote) {
      return new Response("You have already voted for this point", {
        status: 409,
      });
    }

    const newVote = new Vote({
      userId: session.user.id,
      pointId,
      score,
    });

    await newVote.save();

    // Recalcular rating y votes del punto
    await recalculatePointRating(pointId);

    return new Response(JSON.stringify(newVote), { status: 200 });
  } catch (error) {
    console.error("Error creating vote:", error);
    return new Response("Failed to create vote", { status: 500 });
  }
};

// Función para recalcular el rating y votes de un punto
const recalculatePointRating = async (pointId: string) => {
  try {
    const votes = await Vote.find({ pointId });
    const totalVotes = votes.length;
    const totalScore = votes.reduce((sum, vote) => sum + vote.score, 0);
    const averageRating = totalVotes > 0 ? totalScore / totalVotes : 0;

    await Point.findByIdAndUpdate(pointId, {
      votes: totalVotes,
      rating: Math.round(averageRating * 100) / 100, // Redondear a 2 decimales
    });
  } catch (error) {
    console.error("Error recalculating point rating:", error);
  }
};

export const GET = async (): Promise<Response> => {
  try {
    await connectToMongo();
    const votes = await Vote.find({});
    return new Response(JSON.stringify(votes), { status: 200 });
  } catch (error) {
    console.error("Error fetching votes:", error);
    return new Response("Failed to fetch votes", { status: 500 });
  }
};
