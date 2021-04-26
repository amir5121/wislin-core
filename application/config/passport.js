const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy
const User = require("../models/user")

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIEN_ID,
      clientSecret: process.env.GOOGLE_CLIEN_SECRET,
      callbackURL: "/api/user/auth/google/redirect/",
    },
    (accessToken, refreshToken, profile, done) => {
      console.log({ accessToken, refreshToken, profile, done })
      // passport callback function
      //check if user already exists in our db with the given profile ID
      User.findOne({ googleId: profile.id }).then((currentUser) => {
        if (currentUser) {
          //if we already have a record with the given profile ID
          done(null, currentUser)
        } else {
          //if not, create a new user
          User({
            googleId: profile.id,
            email: profile.emails[0].value,
            profilePicture: profile.photos[0].value,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
          })
            .save()
            .then((newUser) => {
              done(null, newUser)
            })
        }
      })
    }
  )
)

passport.serializeUser((user, done) => {
  console.log('serializeUser', user)
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    console.log('deserializeUser', user)
    done(null, user)
  })
})

module.exports = passport
