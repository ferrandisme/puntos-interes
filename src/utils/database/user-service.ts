import { MongoClient, ObjectId } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("puntosinteres");
const usersCollection = db.collection("user");

export interface BetterAuthUser {
  _id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class UserService {
  static async findById(id: string): Promise<BetterAuthUser | null> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let user: any = null;

      try {
        if (ObjectId.isValid(id)) {
          user = await usersCollection.findOne({ _id: new ObjectId(id) });
        }
        if (!user) {
          // @ts-expect-error - Necesario para manejar string IDs que BetterAuth puede usar
          user = await usersCollection.findOne({ _id: id });
        }
      } catch {
        return null;
      }

      return user
        ? {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            emailVerified: user.emailVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          }
        : null;
    } catch (error) {
      console.error("Error finding user by ID:", error);
      return null;
    }
  }

  static async findByEmail(email: string): Promise<BetterAuthUser | null> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const user: any = await usersCollection.findOne({ email });
      return user
        ? {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            emailVerified: user.emailVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          }
        : null;
    } catch (error) {
      console.error("Error finding user by email:", error);
      return null;
    }
  }
}
