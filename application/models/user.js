const mongoose = require("../config/mongoose")

const User = mongoose.model(
  "User",
  mongoose.Schema({
    firstName: String,
    lastName: String,
    googleId: String,
    birthDate: Date,
    email: Date,
    // methods: {
    //   fullName: () => "${this.firstName} ${this.lastName}",
    // },
  })
)

module.exports.User = User
