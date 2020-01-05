const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.set("useUnifiedTopology", true);
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(
    () => {
      // TODO - use logger
      console.log("DB Connection opened");
    },
    error => {
      // TODO - use logger
      console.log("DB Connection open error", error);
    }
  );

function disconnectIfNeeded() {
  if (process.env.NODE_ENV === "testing") {
    setTimeout(() => mongoose.disconnect(), 0);
  }
}

module.exports = { mongoose, disconnectIfNeeded };
