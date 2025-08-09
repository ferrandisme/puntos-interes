import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IPoint extends Document {
  category: String;
  name: String;
  author: String;
  latitude: Number;
  longitude: Number;
  description: String;

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
  }
  ,
    longitude: {
    type: Number,
    required: true,
  },
    description: {
    type: String,
    required: true,
  }
});

const Point = models.Point || model<IPoint>("Point", PointSchema);
export default Point;
