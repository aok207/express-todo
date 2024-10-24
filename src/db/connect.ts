import mongoose from "mongoose";

export default async function connectToDB() {
  const uri: string = process.env.MONGO_URI || "";

  try {
    console.log("Connecting to mongo...");

    await mongoose.connect(uri);

    console.log("Connected to mongo successfully...");
  } catch (err: any) {
    console.error("Connecting to mongo failed.");
    console.error(err);
  }
}
