import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "../../../helper/db";
import { verifyPassword } from "../../../helper/auth";

export default NextAuth({
    session: {
      jwt: true,
    },
  
    providers: [
      CredentialsProvider({
        async authorize(credentials) {
          const client = await connectToDatabase();
  
          const userCollection = client.db().collection("users");
  
          const user = await userCollection.findOne({ email: credentials.email });
  
          if (!user) {
            throw new Error("No user found !");
          }
  
          const isValid = await verifyPassword(
            credentials.password,
            user.password
          );
  
          if (!isValid) {
            client.close();
            throw new Error("Could not log you in!");
          }
  
          client.close();
          return {
            email: user.email,
          };
        },
      }),
    ],
  });
  