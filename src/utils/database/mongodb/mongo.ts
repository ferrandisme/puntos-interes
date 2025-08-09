import mongoose from "mongoose";

let isConnected = false;
export const connectToMongo = async () => {
  mongoose.set("strictQuery", true);
  if (isConnected) {
    console.log("MongoDB is already connected");
  }
  try {
    console.log("----------------------------------\nConnecting MongoDB...");
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error(
        "MONGODB_URI is not definied in the environment variables"
      );
    }

    await mongoose.connect(mongoUri, { dbName: "puntosinteres" });
    isConnected = true;
    console.log("MongoDB is connected");
  } catch (error) {
    console.log(error);
  }
};
