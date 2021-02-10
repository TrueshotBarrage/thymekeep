import { google } from "googleapis";

export default async (_, res) => {
  // Set up Google API OAuth2 client
  const googleAuth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL
  );

  // Generate a url that asks permissions for Google Calendar scope
  const url = googleAuth.generateAuthUrl({
    access_type: "offline", // 'online' (def) or 'offline' (gets refresh_token)
    scope: "https://www.googleapis.com/auth/calendar openid email profile"
  });

  // Set response headers & information
  res.statusCode = 200;
  res.json({ url: url });
}
