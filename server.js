const express = require("express");
const path = require("path");
const fileHandler = require("./modules/fileHandler");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  const employees = await fileHandler.read();
  res.render("index", { employees });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
