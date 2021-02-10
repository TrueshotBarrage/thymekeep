import { google } from "googleapis";

export default function test() {
  const googleAuth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL
  );

  // Generate a url that asks permissions for Google Calendar scope
  const url = googleAuth.generateAuthUrl({
    access_type: "offline", // 'online' (def) or 'offline' (gets refresh_token)
    scope: "https://www.googleapis.com/auth/calendar"
  });

  console.log(url);
}