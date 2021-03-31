import { getToken } from "next-auth/jwt";
import { getUserInfo } from "../../../google-api/api";

const secret = process.env.JWT_SECRET;
const encryption = true;

export default async (req, res) => {
  const token = await getToken({ req, secret, encryption });

  if (token) {
    const accessToken = token.accessToken;
    const resp = await getUserInfo(accessToken);

    if (resp.error) {
      res.status(resp.error.code).json(resp.error.message);
    } else if (resp.status) {
      res.status(resp.status).json(resp.data);
    }
  } else {
    res.status(401).send("Not Authenticated");
  }
};
