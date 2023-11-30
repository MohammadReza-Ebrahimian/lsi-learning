import { getSession } from "next-auth/react";
import { connectToDatabase } from "../../../helper/db";
import { hashPassword, verifyPassword } from "../../../helper/auth";
import { getToken } from "next-auth/jwt";

async function handler(req, res) {
  if (req.method !== "PATCH") {
    return;
  }

  // const session  = await getSession({ req });

  const token = await getToken({ req });
  console.log(token);

  // if (!session) {
  //   res.status(401).json({ message: "Not authenticated!" });
  //   return;
  // }

  const userEmail = session.user.email;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newpassword;

  const client = await connectToDatabase();
  const usersCollecton = client.db().collection("users");
  const user = await usersCollecton.findOne({ email: userEmail });

  if (!user) {
    res.status(404).json({ message: "User Not Found" });
    client.close();
    return;
  }

  const currentPassword = user.password;

  const passwordAreEqual = await verifyPassword(oldPassword, currentPassword);

  if (!passwordAreEqual) {
    res.status(403).json({ message: "Invalid Password" });
    client.close();
    return;
  }

  const hashedPassword = await hashPassword(newPassword);

  const result = await usersCollecton.updateOne(
    { email: userEmail },
    {
      $set: { password: hashedPassword },
    }
  );

  client.close();
  res.status(200).json({ message: "Password Updated." });
}

export default handler;
