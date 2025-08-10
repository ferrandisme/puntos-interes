import { Schema, Document, models, model } from "mongoose";

export interface IVote extends Document {
  userId: string;
  pointId: string;
  score: number;
}

const VoteSchema = new Schema<IVote>(
  {
    userId: {
      type: String,
      required: true,
    },
    pointId: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

// Índice único compuesto para evitar votos duplicados
VoteSchema.index({ userId: 1, pointId: 1 }, { unique: true });

const Vote = models.Vote || model<IVote>("Vote", VoteSchema);
export default Vote;
