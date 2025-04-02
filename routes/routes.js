const router = require('express').Router();
const passport = require('passport')

router.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }));

router.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' ,
    session: false
  }),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log(req.user)
  });

module.exports = router;