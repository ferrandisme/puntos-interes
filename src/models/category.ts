import mongoose, { Schema, Document, models, model } from "mongoose";

export interface ICategory extends Document {
  name: string;
}

const CategorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: true,
  },
});

const Category =
  models.Category || model<ICategory>("Category", CategorySchema);
export default Category;
