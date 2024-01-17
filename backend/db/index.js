const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.MONOGODB_URI)
  .then(() => console.log("Connected mongo db"))
  .catch((e) => console.log(e));
