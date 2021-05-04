import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_DB_CONNECTION_URL || "mongodb://localhost/wislin", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection

db.on("error", console.error.bind(console, "connection error:"))
db.once("open", function () {
  console.log("Mongo connection is now open")
})

export default mongoose
