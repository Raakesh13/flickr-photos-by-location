const path = require("path");
const express = require("express");
const app = express();
const publicpath = path.join(__dirname, "..", "build");
const port = process.env.PORT;

console.log(publicpath);

app.use(express.static(publicpath));

app.get("*", (req, res) => {
  res.sendFile(path.join(publicpath, "index.html"));
});

app.listen(port, () => {
  console.log("Server is up at https://localhost/3000");
});