import { getToken } from "next-auth/jwt";

const secret = process.env.JWT_SECRET;
const encryption = true;

export default async (req, res) => {
  const token = await getToken({ req, secret, encryption });
  console.log("JSON Web Token", token); // Check NodeJS console!
  res.end();
};
