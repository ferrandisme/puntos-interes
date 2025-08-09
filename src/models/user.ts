import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IUser extends Document {
  name: String;
  email: String;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
    email: {
    type: String,
    required: true,
  }
});

const User = models.User || model<IUser>("User", UserSchema);
export default User;
