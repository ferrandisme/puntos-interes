import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IVote extends Document {
  userId: String;
  pointId: String;
  score: Number;

}

const VoteSchema = new Schema<IVote>({
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
  }
});

const Vote = models.Vote || model<IVote>("Vote", VoteSchema);
export default Vote;
