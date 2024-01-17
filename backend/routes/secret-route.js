const express = require("express");
const secretRouter = express.Router();

const {
  fetchSecrets,
  addSecret,
  deleteSecret,
  updateSecret,
} = require("../controller/secret-controller");

secretRouter.get("/", fetchSecrets);
secretRouter.post("/add", addSecret);
secretRouter.put("/update/:id", updateSecret);
secretRouter.delete("/delete/:id", deleteSecret);

module.exports = secretRouter;
