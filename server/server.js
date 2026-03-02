const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT;

const corsOption = {
  origin: process.env.FRONTEND_URL,
};

app.use(cors(corsOption));
app.use(express.json());

app.get("/", (req, res) => {
  res.json("Hello World");
});

app.post("/signup", (req, res) => {
  console.log("User Data Received:", req.body);

  // Here you would eventually save to a database
  res.status(201).json({
    message: "User created successfully!",
    user: req.body.username,
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
