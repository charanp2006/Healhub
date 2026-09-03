import mongoose from "mongoose";

declare global {
   
  var mongooseGlobal:
    | { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
    | undefined;
}

const MONGODB_URI = `${process.env.MONGODB_URI || "mongodb://localhost:27017"}/healhub`;

const cached: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } =
  globalThis.mongooseGlobal ?? (globalThis.mongooseGlobal = { conn: null, promise: null });

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((instance) => instance);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
