const mongoose = require("../config/mongoose")

const User = mongoose.model(
  "User",
  mongoose.Schema({
    firstName: String,
    lastName: String,
    googleId: String,
    birthDate: Date,
    email: String,
    profilePicture: String,
    // methods: {
    //   fullName: () => "${this.firstName} ${this.lastName}",
    // },
  })
)

module.exports = User
