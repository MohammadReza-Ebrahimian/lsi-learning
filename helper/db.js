import { MongoClient } from "mongodb";

export async function connectToDatabase() {
  const client = await MongoClient.connect(
    "mongodb+srv://menezhad:jiZA89n3KCtvMHLM@cluster0.vswaaok.mongodb.net/?retryWrites=true&w=majority"
  );

  return client;
}

