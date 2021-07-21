const express = require("express");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });

const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

app
  .prepare()
  .then(() => {
    const server = express();

    server.use((req, res, next) => {
      const hostname =
        req.hostname === "www.thymekeep.com" ? "thymekeep.com" : req.hostname;

      // if (
      //   req.headers["x-forwarded-proto"] === "http" ||
      //   req.hostname === "www.thymekeep.com"
      // ) {
      //   res.redirect(301, `https://${hostname}${req.url}`);
      //   return;
      // }

      res.setHeader(
        "strict-transport-security",
        "max-age=31536000; includeSubDomains; preload"
      );
      next();
    });

    server.all("*", (req, res) => handle(req, res));

    server.listen(PORT, (error) => {
      if (error) throw error;
      console.error(`Listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
