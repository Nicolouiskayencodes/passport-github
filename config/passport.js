const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const pool = require('../db/pool.js')

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_KEY
}

passport.use( new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const user = await db.getUser(jwt_payload.username)
    if (user) {
      return done(null, user)
    }
    return done(null, false)
  } catch (err) {
    return done(err)
  }
}))

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "http://127.0.0.1:3000/auth/github/callback"
},
async function(accessToken, refreshToken, profile, done) {
  console.log(accessToken, refreshToken, profile)
  const { rows } = await pool.query("SELECT * FROM users WHERE email = " + profile.email + ";");
  console.log(rows)
  // User.findOrCreate({ githubId: profile.id }, function (err, user) {
  //   return done(err, user);
  // });
}
));
