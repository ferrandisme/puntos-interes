import { Schema, Document, models, model } from "mongoose";
import { Types } from "mongoose";

export interface IPoint extends Document {
  category: Types.ObjectId;
  name: string;
  author: string;
  description: string;
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  votes: number;
  rating: number;
}

const PointSchema = new Schema<IPoint>({
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
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
  location: {
    type: { type: String, enum: ["Point"], required: true, default: "Point" },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },

  description: {
    type: String,
    required: true,
  },
  votes: {
    type: Number,
    required: false,
  },
  rating: {
    type: Number,
    required: false,
  },
});

// Índice geoespacial para búsquedas rápidas
PointSchema.index({ location: "2dsphere" });

const Point = models.Point || model<IPoint>("Point", PointSchema);
export default Point;
