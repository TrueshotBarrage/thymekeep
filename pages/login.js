import { useEffect } from 'react'
import { useRouter } from 'next/router'
const axios = require("axios");

// Here you would fetch and return the user
const useUser = () => ({ user: null, loading: false })

// Get the OAuth URL from our server API
const getGoogleSignInURL = async function () {
  var url = await (async () => {
    try {
      const response = await axios.get("/api/googleapi");
      return response.data.url;
    } catch (error) {
      console.log(error.response.body);
    }
  })();
  return url;
}

export default function Login() {
  const { user, loading } = useUser();

  // Only trigger when "user" or "loading" change.
  useEffect(async () => {
    if (!(user || loading)) {
      // Redirect to the Google OAuth login page
      let url = await getGoogleSignInURL();
      window.location.replace(url);
    }
  }, [user, loading]);

  return <p>Redirecting...</p>;
}