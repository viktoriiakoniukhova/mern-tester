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

app.use(
  cors({
    origin: ["https://mern-tester-front.vercel.app/"],
    credentials: true,
    sameSite: "none",
  })
);
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
