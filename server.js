var express = require('express');
var session = require('express-session');
var passport = require('passport');
var githubStrategy = require('passport-github2').Strategy;
var request = require('request');
var middleware = require('./middleware.js')
var bodyParser = require('body-parser');
var cors = require('cors');

var port = 3033;
var app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(session({secret:"i can talk to animals"}))
app.use(passport.initialize())
app.use(passport.session())

app.use(express.static('public'))

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new githubStrategy({
  clientID: '4560ab9455e25e20a8fc',
  clientSecret: '505f50a060f11988487c1a828186231f81c4f2ac',
  callbackURL: 'http://localhost:3033/auth/github/callback'
}, function(accessToken, refreshToken, profile, done) {
  console.log(profile._json.followers_url);
  var user = {
    profile: profile,
    token: accessToken
  }
  return done(null, user);
}));

var requireAuth = function(req, res, next) {
if (!req.isAuthenticated()) {
  return res.status(403).end();
}
return next();
}

app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github', { successRedirect: '/#/home',
          failureRedirect: '/' }));


app.get('/api/github/followers', requireAuth, function(req, res) {
console.log(req.user.profile._json.followers_url)
  request.get(req.user.profile._json.followers_url, {
    'auth': {
      'bearer': req.user.token
    },
    'headers': {
      'User-Agent':'request'
    }
  }, function(err, response, body) {
    res.json(response.body);
  })
})


app.listen(port, function() {
  console.log("listening on port " + port)
})

// const express = require('express');
// const session = require('express-session');
// const passport = require('passport');
// const cors = require('cors');
// const GitHubStragegy = require('passport-github2').Strategy;
// const GitHubApi = require('github');
// const config = require('./config')
//
//
// const app = express();
// const port = 3000;
//
// app.use( cors());
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(express.static(__dirname + '/Public'));
//
// passport.use(new GitStrategy ({
//   clientID: 'c58c9f4f84c71e8388f3',
//   clientSecret: 'abcb0ec2f0755ef1255bb071764754e5e4a5ed1e',
//   callbackURL: 'http://localhost:3000/auth/github/callback'
// },
// function (accessToken, refreshToken, profile, done) {
//     return done(null, profile);
//   }
// ));
//
// app.get('/auth/github', passport.authenticate('github'));
// app.get('/auth/github/callback', passport.authenticate('github'), {
//   successRedirect: '/#/home',
//   failureRedirect: '/auth/github'
// })
//
// passport.serializeUser(function(user, done) {
//   done(null, user);
// });
//
// passport.deserializeUser(function (obj, done) {
//   done(null, obj);
// })
//
// app.listen(port);
