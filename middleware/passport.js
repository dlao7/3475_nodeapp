const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;

const userController = require("../controller/user_controller");
const userModel = require("../models/userModel").userModel;

const devID = require("../devIDs");

const localLogin = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async (email, password, done) => {
    const user = await userController.getUserByEmail(email, password);

    return user
      ? done(null, user)
      : done(null, false)
  }
);

const githubLogin = new GitHubStrategy(
  {
    clientID: devID.clientID,
    clientSecret: devID.clientSecret,
    callbackURL: "https://dlao.net:3001/auth/github/callback"
  },
  async (accessToken, refreshToken, profile, done) => { 
    const user = await userController.getUserBySocialId(profile.provider, profile.id);

    if (user){
      return done(null, user);
    } else {
      let userEntry = await userModel.createNewUser(profile, "social");
      
      return done(null, userEntry);
    }
});

passport.serializeUser((user, done) => {
  done(null, user.userID);
});

passport.deserializeUser(async (id, done) => {
  let user = await userController.getUserById(id);
  if (user) {
    done(null, user);
  } else {
    done({ message: "User not found" }, null);
  }
});

module.exports = passport.use(localLogin), passport.use(githubLogin);
