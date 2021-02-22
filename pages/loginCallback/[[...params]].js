import React, { useEffect } from 'react'
import { useRouter } from 'next/router'

const axios = require("axios");

async function getAuthTokens(authCode) {
  const tokenPost = {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_REDIRECT_URL,
    grant_type: "authorization_code",
    code: authCode
  };

  // Make POST request to Google's servers to get access & refresh tokens

  const resp = (async () => {
    try {
      const tokenResp = await axios.post("https://oauth2.googleapis.com/token", tokenPost);
      return tokenResp;
    } catch (err) {
      return err.response.data;
    }
  })();

  return resp;
}

async function getUserInfo(accessToken) {
  try {
    const userInfo = await axios.get("https://www.googleapis.com/oauth2/v1/userinfo", {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });
    return userInfo;
  } catch (err) {
    return err.response.data;
  }
}

function LoginCallbackAux(props) {
  let output = props.data.tokens;

  // Get the auth code returned from the query string params in the URL
  const router = useRouter();
  const authCode = router.query.code;

  useEffect(async () => {
    if (authCode) {
      const tokens = await getAuthTokens(authCode);
      props.onUpdate({ tokens: tokens });
      if (tokens.data) {
        const userInfo = await getUserInfo(tokens.data.access_token);
        props.onUpdate({ tokens: userInfo });
      }
    }
  }, [authCode]);

  return (
    typeof (output) !== "object" || !output.data ?
      <p>{JSON.stringify(output)}</p> :
      <>
        <h1>Welcome {output.data.name}!</h1>
        <img src={output.data.picture} />
      </>
  );
}

export default class LoginCallback extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tokens: "Checking login..."
    };
  }

  onUpdate(tokens) {
    this.setState({ tokens });
  }

  render() {
    return (
      <LoginCallbackAux
        data={this.state.tokens}
        onUpdate={(d) => this.onUpdate(d)}
      />
    );
  }
}