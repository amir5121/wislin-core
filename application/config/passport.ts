import passport from "passport"
import { OAuth2Strategy } from "passport-google-oauth"
import User from "../models/user"

passport.use(
  new OAuth2Strategy(
    {
      clientID: process.env.GOOGLE_CLIEN_ID || "",
      clientSecret: process.env.GOOGLE_CLIEN_SECRET || "",
      callbackURL: "/api/user/auth/google/redirect/"
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
          new User({
            googleId: profile.id,
            email: profile.emails && profile.emails[0].value,
            profilePicture: profile.photos && profile.photos[0].value,
            firstName: profile?.name?.givenName,
            lastName: profile?.name?.familyName
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

passport.serializeUser((user: any, done) => {
  console.log("serializeUser", user)
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    console.log("deserializeUser", user)
    done(null, user)
  })
})

export default passport