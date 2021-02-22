import React, { useEffect } from "react";
import { useRouter } from "next/router";

import {
  getAuthTokens,
  getUserInfo,
  getCalendarList,
  getCalendar,
  postQuickEvent,
} from "../../google-api/api.js";

const axios = require("axios");

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
        const accessToken = tokens.data.access_token;
        const userInfo = await getUserInfo(accessToken);
        // const userCalendar = await postQuickEvent(
        //   accessToken,
        //   "davidkim2106@gmail.com",
        //   "Test event!"
        // );
        // console.log(userCalendar);
        props.onUpdate({ tokens: userInfo });
      }
    }
  }, [authCode]);

  return typeof output !== "object" || !output.data ? (
    <p>{JSON.stringify(output)}</p>
  ) : (
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
      tokens: "Checking login...",
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
