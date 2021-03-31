import { getToken } from "next-auth/jwt";
import { getCalendar, getEvents, getEvent } from "../../../../google-api/api";

const secret = process.env.JWT_SECRET;
const encryption = true;

export default async (req, res) => {
  const token = await getToken({ req, secret, encryption });

  if (token) {
    const accessToken = token.accessToken;

    let { query } = req.query;
    if (!query) {
      res.status(500).send("Invalid API call, maybe empty route?");
      return;
    }

    // Check the number of route elements in the call, and reroute as needed
    let resp;
    switch (query.length) {
      case 1: // e.g. /api/get/calendars/{cid}
        resp = await getCalendar(accessToken, query[0]);
        break;
      case 2: // e.g. /api/get/calendars/{cid}/events
        resp = await getEvents(accessToken, query[0]);
        break;
      case 3: // e.g. /api/get/calendars/{cid}/events/{eid}
        if (query[1] === "events") {
          resp = await getEvent(accessToken, query[0], query[2]);
        } else {
          res.status(404).send("Not a valid API request");
        }
        break;
      default:
        res.status(404).send("Not a valid API request");
        return;
    }

    if (resp.error) {
      res.status(resp.error.code).json(resp.error.message);
    } else if (resp.status) {
      res.status(resp.status).json(resp.data);
    }
  } else {
    res.status(401).send("Not Authenticated");
  }
};
