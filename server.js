"use strict";

const express = require("express");

// Constants
const PORT = 8080;
const HOST = "127.0.0.1";

// App
const app = express();
app.get("/", (req, res) => {
  res.send("Hello World");
});

// sample function

app.listen(PORT, HOST);
