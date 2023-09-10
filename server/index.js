const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const PORT = 5000;
const authRoute = require("./routes/authRoute");
const testRoute = require("./routes/testRoute");
const questionRoute = require("./routes/questionRoute");

const cors = require("cors");
const bodyParser = require("body-parser");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");

// app.use(
//   cors({
//     origin: ["https://mern-tester-front.vercel.app/"],
//     methods: ["GET", "POST", "DELETE", "PUT"],
//     credentials: true,
//     sameSite: "none",
//   })
// );

// Set middleware of CORS
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://mern-tester-front.vercel.app/"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Private-Network", true);
  //  Firefox caps this at 24 hours (86400 seconds). Chromium (starting in v76) caps at 2 hours (7200 seconds). The default value is 5 seconds.
  res.setHeader("Access-Control-Max-Age", 7200);

  next();
});

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

app.use("/api/user", authRoute);
app.use("/api/test", testRoute);
app.use("/api/question", questionRoute);
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
