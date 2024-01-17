require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/auth-router");
const secretRouter = require("./routes/secret-route");
const errorMiddleware = require("./middleware/error-middleware");
const path = require("path");

require("./db");

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.resolve(__dirname, "dist")));
app.use("/api/auth", authRouter);
app.use("/api/secrets", secretRouter);

// app.use("/api", (req, res) => {
//   res.send("Hello World");
// });
app.get("*", (req, res) => res.sendFile(path.resolve("dist", "index.html")));

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`App is running at ${PORT}...`));
