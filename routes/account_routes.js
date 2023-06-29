const express = require('express');
const router = express.Router();
const account_controller = require('../controllers/account_controller');

const passport = require('passport');

router.post('/register', account_controller.email_register);
router.put('/update', account_controller.account_update);
router.put('/login', account_controller.account_login);

router.get(
  '/google-auth',
  passport.authenticate('google', {scope: ['profile', 'email']}),
);
router.get(
  '/google-auth/redirect',
  passport.authenticate('google', {failureRedirect: '/google-auth'}),
  (req, res) => {
    account_controller.google_auth_passport(req, res);
  },
);
router.get(
  '/kakao-auth',
  passport.authenticate('kakao', {
    scope: ['profile_nickname', 'account_email'],
  }),
);

router.get(
  '/kakao-auth/redirect',
  passport.authenticate('kakao', {failureRedirect: '/kakao-auth'}),
  (req, res) => {
    account_controller.kakao_auth_passport(req, res);
  },
);
// router.get('/google-auth', account_controller.google_auth);
// router.get('/google-auth/redirect', account_controller.google_auth_redirect);

router.get('/find-id', account_controller.find_id);
router.get('/find-password', account_controller.find_password);
router.post('/email-verification', account_controller.email_verification);

module.exports = router;
