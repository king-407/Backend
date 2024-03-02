const express = require("express");
const bodyParser = require("body-parser");

const cors = require("cors");
const db = require("./db");
const dotenv = require("dotenv");
const userRouter = require("./routes/userRouter");
const postsRouter = require("./routes/postsRouter");
const commentRouter = require("./routes/commentRouter");
const errorM = require("./middleware/errorMiddleware");
dotenv.config();
const app = express();
db();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/user", userRouter);
app.use("/posts", postsRouter);
app.use("/comments", commentRouter);
app.use(errorM);
app.listen(3000, () => {
  console.log("server running");
});
