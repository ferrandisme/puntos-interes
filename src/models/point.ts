import { Schema, Document, models, model } from "mongoose";

export interface IPoint extends Document {
  category: string;
  name: string;
  author: string;
  latitude: number;
  longitude: number;
  description: string;
}

const PointSchema = new Schema<IPoint>({
  category: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const Point = models.Point || model<IPoint>("Point", PointSchema);
export default Point;
