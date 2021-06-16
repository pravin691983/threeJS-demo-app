//Install express server
const express = require("express");
const path = require("path");

const app = express();

// // Serve only the static files form the dist directory
// app.use(express.static("./dist/angular-three-js-demo-app"));

// app.get("/*", (req, res) =>
//   res.sendFile("index.html", { root: "dist/angular-three-js-demo-app/" })
// );

// This middleware informs the express application to serve our compiled React files
if (
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "staging"
) {
  app.use(
    express.static(path.join(__dirname, "./dist/angular-three-js-demo-app"))
  );

  app.get("*", function (req, res) {
    // res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    res.sendFile(
      path.resolve(
        __dirname,
        ".",
        "dist",
        "angular-three-js-demo-app",
        "index.html"
      )
    );
  });
}

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
