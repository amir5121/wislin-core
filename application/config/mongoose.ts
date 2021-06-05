import mongoose from "mongoose"

mongoose
  .connect(
    process.env.MONGO_DB_CONNECTION_URL || "mongodb://localhost/wislin",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }
  )
  .then((_) => {
    console.log("Mongo connection is connected")
  })

const db = mongoose.connection

db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => console.log("Mongoose connection open"))

export function onInsertCallback(err: any, docs: any) {
  if (err) {
    console.log("onInsertCallback", err)
    throw err
  } else {
    console.info(
      "onInsertCallback: %d potatoes were successfully stored.",
      docs.length
    )
  }
}

export default mongoose
