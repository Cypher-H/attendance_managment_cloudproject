const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const verifyToken = require("./verifyToken");
const mongoose = require("mongoose");
const config = require("./config");

const app = express();

const authRouter = require("./auth");
const userCreate = require("./Routes/userCreate");
const subjectRouter = require("./Routes/subjectRoute")
const teacherRouter = require("./Routes/teacherRoute")
const attendanceRouter = require("./Routes/attendanceRoute")
const enrollmentRouter = require("./Routes/EnrollmentRoute")


app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(config.mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    autoIndex: true,
    useCreateIndex: true,
  })
  .then((v) => {
    console.log("Mongoose connection established successfully");
  });

app.get("/", verifyToken, (req, res, next) => {
  res.json({ test: "Hello World" });
});

app.use("/", authRouter);
app.use("/", userCreate);
app.use("/", subjectRouter);
app.use("/", teacherRouter);
app.use("/", attendanceRouter);
app.use("/", enrollmentRouter);

app.listen(config.PORT, () => {
  console.log(`Server running at ${config.PORT}`);
});
