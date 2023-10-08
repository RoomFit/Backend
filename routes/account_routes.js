const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
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
router.put('/change_password', account_controller.change_password);
router.get('/user-info', account_controller.user_info);
router.post('/email-duplication', account_controller.check_email);
router.post('/withdraw', account_controller.withdraw);
router.post(
  '/profile',
  upload.single('profile'),
  account_controller.profile,
);
router.post('/save_range_percent', account_controller.save_range_percent);
router.post('/load_range_percent', account_controller.load_range_percent);
router.post('/load_measure_count', account_controller.load_measure_count);
module.exports = router;
