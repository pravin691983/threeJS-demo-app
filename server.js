//Install express server
const express = require("express");
const path = require("path");

const app = express();

// Serve only the static files form the dist directory
app.use(express.static(__dirname + "/dist/angular-three-js-demo-app"));

app.get("/*", function (req, res) {
  res.sendFile(
    path.join(__dirname + "/dist/angular-three-js-demo-app/index.html")
  );
});
