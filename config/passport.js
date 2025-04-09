const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
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
  console.log(profile.emails[0].value)
  try {
  const { rows } = await pool.query("SELECT * FROM users WHERE email = '" + profile.emails[0].value + "';"); 
  const user = rows[0]
  console.log("here", user)
  if (rows.length = 0) {
   await pool.query("INSERT INTO users (email) VALUES ('" + profile.emails[0].value + "');")
   const { rows } = await pool.query("SELECT * FROM users WHERE email = '" + profile.emails[0].value + "';")
  return done(null, user)
  }
  return done(null, user)
  }
  catch (err) {

    return done(err, null)
  }
//   try {
//     const { rows } = await pool.query("SELECT * FROM users WHERE email = '" + profile.emails[0].value + "';"); 
//   console.log(rows)
//   const token = jwt.sign(rows, process.env.JWT_KEY, { expiresIn: '365d' }) 
//   return done(err, token)
// }
//   catch (err) {
//   await pool.query("INSERT INTO users (email) VALUES ('" + profile.emails[0].value + "');")
//   const { rows } = await pool.query("SELECT * FROM users WHERE email = '" + profile.emails[0].value + "';")
//   console.log(rows)
//   const token = jwt.sign(rows, process.env.JWT_KEY, { expiresIn: '365d' }) 
//   return done(err, token)
//   }
}
)
);
