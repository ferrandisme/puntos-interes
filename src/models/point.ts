import { Schema, Document, models, model } from "mongoose";

export interface IPoint extends Document {
  category: string;
  name: string;
  author: string;
  description: string;
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
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
 location: {
    type: { type: String, enum: ["Point"], required: true, default: "Point" },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },

  description: {
    type: String,
    required: true,
  },
});

// Índice geoespacial para búsquedas rápidas
PointSchema.index({ location: "2dsphere" });

const Point = models.Point || model<IPoint>("Point", PointSchema);
export default Point;
