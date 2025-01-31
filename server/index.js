require("dotenv").config();
const jwt = require("jsonwebtoken");
const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json({ limit: "100mb" }));
app.use(require("cors")());
app.use("/user", require("./Routers/User"));
app.use("/image", require("./Routers/Image"));
app.use("/image", express.static("image"));
app.use("/post", require("./Routers/Post"));
app.use("/question", require("./Routers/Question"));
app.use("/answer", require("./Routers/Answer"));
app.use("/verify", require("./Routers/Verify"));
app.use("/lesson", require("./Routers/Lesson"));
app.use("/block", require("./Routers/Block"));
app.use("/serie", require("./Routers/Serie"));
app.use("/search", require("./Routers/Search"));
app.use("/item", require("./Routers/Item"));
app.use("/service", require("./Routers/Service"));
app.use("/material", require("./Routers/Material"));
app.use("/case", require("./Routers/Case"));
app.use("/sale", require("./Routers/Sale"));

app.listen(
  5000,
  mongoose
    .connect(
      `mongodb+srv://tiqu:tiqu@eightman.rlpt6.mongodb.net/?retryWrites=true&w=majority&appName=eightman`
    )
    .then(() => console.log("Successfully connected to the Database"))
    .catch((err) => console.log(err))
);
