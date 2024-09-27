const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;
var favicon = require("serve-favicon");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});
app.get("/SW.js", (req, res) => {
  res.sendFile(path.resolve(__dirname, "SW.js"));
});
app.get("/public/pwa.webmanifest", (req, res) => {
  res.sendFile(path.resolve(__dirname, "pwa.webmanifest"));
});

app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));
app.listen(port);
