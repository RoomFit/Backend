const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
const session = require('express-session');
const crypto = require('crypto');
require('dotenv').config();

const initPassport = app => {
  app.use(
    session({
      resave: false,
      saveUninitialized: true,
      secret: crypto.randomBytes(32).toString('hex'),
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_SIGNUP_REDIRECT_URI,
    },
    async (accessToken, refreshToken, profile, done) => {
      done(null, profile._json);
    },
  ),
);

passport.use(
  new KakaoStrategy(
    {
      clientID: process.env.KAKAO_CLIENT_ID,
      // clientSecret: process.env.KAKAO_CLIENT_SECRET, // clientSecret을 사용하지 않는다면 넘기지 말거나 빈 스트링을 넘길 것
      callbackURL: process.env.KAKAO_SIGNUP_REDIRECT_URI,
    },
    (accessToken, refreshToken, profile, done) => {
      done(null, profile._json);
    },
  ),
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

const formatGoogle = profile => {
  return {
    firstName: profile.given_name,
    lastName: profile.family_name,
    email: profile.emaiL,
  };
};

const formatKakao = profile => {
  return {
    firstName: profile.properties.nickname,
    lastName: '',
    email: profile.kakao_account.email,
  };
};

module.exports = initPassport;
