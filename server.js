const express = require("express");
const fileHandler = require("./modules/fileHandler");

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Payroll App Server Running");
});

async function startServer() {
  const employees = await fileHandler.read();
  console.log("Employees loaded from JSON:");
  console.log(employees);

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
