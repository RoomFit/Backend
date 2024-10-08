const Account = require('../models/account_model');
const upload = require('../config/multer');
const email_register = (req, res) => {
  if (!req.body)
    res.status(400).send({
      message: 'Content can not be empty!',
    });

  const account = new Account({
    user_id: req.body.user_id,
    user_name: req.body.user_name,
    email: req.body.email,
    password: req.body.password,
    is_api: 0,
  });

  Account.create(account, (err, is_success) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Some error occurred while creating Account.',
        success: 0,
      });
    else {
      res.json({
        user_id: account.user_id,
        user_name: account.user_name,
        email: account.email,
        success: is_success,
      });
    }
  });
};

const account_update = (req, res) => {
  if (!req.body)
    res.status(400).send({
      message: 'Content can not be empty!',
    });

  const update_account = new Account({
    user_id: req.body.user_id,
    user_name: req.body.user_name || undefined,
    birth: req.body.birth || undefined,
    gender: req.body.gender || undefined,
    height: req.body.height || undefined,
    weight: req.body.weight || undefined,
    experience: req.body.experience || undefined,
    body_fat: req.body.body_fat || undefined,
    set_break: req.body.set_break || undefined,
    motion_break: req.body.motion_break || undefined,
  });
  //(update_account);
  Account.update(update_account, (err, user_data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Some error occured while updating Workout.',
      });
    else {
      user_data['success'] = 1;
      res.json(user_data);
    }
    // else res.send(data);
  });
};

const account_login = (req, res) => {
  if (!req.body)
    res.status(400).send({
      message: 'Content can not be empty!',
    });

  const account = new Account({
    email: req.body.email,
    password: req.body.password,
    is_api: 0,
  });

  Account.login(account, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Some error occurred while login.',
        success: 0,
      });
    else {
      //console.log(data);
      res.json({
        user_id: data.user_id,
        user_name: data.user_name,
        email: data.email,
        success: data.success,
      });
    }
  });
};

const axios = require('axios');
const GOOGLE_TOKEN_URL = process.env.GOOGLE_TOKEN_URL;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_SIGNUP_REDIRECT_URI = process.env.GOOGLE_SIGNUP_REDIRECT_URI;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_USERINFO_URL = process.env.GOOGLE_USERINFO_URL;

const google_auth = (req, res) => {
  let url = 'https://accounts.google.com/o/oauth2/v2/auth';
  url += `?client_id=${encodeURIComponent(GOOGLE_CLIENT_ID)}`;
  url += `&redirect_uri=${encodeURIComponent(GOOGLE_SIGNUP_REDIRECT_URI)}`;
  url += '&response_type=code';
  url += '&scope=email%20profile';

  res.redirect(url);
};

const google_auth_redirect = async (req, res) => {
  const {code} = req.query;
  // access_token, refresh_token 등의 구글 토큰 정보 가져오기
  const resp = await axios.post(GOOGLE_TOKEN_URL, {
    // x-www-form-urlencoded(body)
    code,
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    redirect_uri: GOOGLE_SIGNUP_REDIRECT_URI,
    grant_type: 'authorization_code',
  });
  // email, google id 등의 사용자 구글 계정 정보 가져오기
  const resp2 = await axios.get(GOOGLE_USERINFO_URL, {
    // Request Header에 Authorization 추가
    headers: {
      Authorization: `Bearer ${resp.data.access_token}`,
    },
  });

  // 구글 인증 서버에서 json 형태로 반환 받은 body 클라이언트에 반환
  const account = new Account({
    user_id: resp2.data.id,
    user_name: resp2.data.name,
    email: resp2.data.email,
    is_api: '1',
  });

  Account.google_auth(account, (err, id, isRegister) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Some error occurred while creating Account.',
        success: 0,
      });
    else {
      res.json({
        user_id: id,
        success: 1,
        isRegister: isRegister,
      });
    }
  });
};

const google_auth_passport = async (req, res) => {
  const account = new Account({
    user_id: req.user.sub,
    user_name: req.user.name,
    email: req.user.email,
    is_api: '1',
  });

  Account.google_auth(account, (err, id, isRegister) => {
    if (err) {
      // res.status(500).send({
      //   message: err.message || 'Some error occurred while creating Account.',
      //   success: 0,
      // });
      const message =
        err.message || 'Some error occurred while creating Account.';
      const success = 0;
      res.redirect(
        `memcaps://account/google_auth?message=${message}/success=${success}`,
      );
    } else {
      const user_id = id;
      const success = 1;
      res.redirect(
        `memcaps://account/google_auth?user_id=${user_id}/success=${success}/isRegister=${isRegister}/email=${account.email}`,
      );

      // res.json({
      //   user_id: account.user_id,
      //   success: 1,
      //   isRegister: isRegister,
      // });
    }
  });
};

const kakao_auth_passport = async (req, res) => {
  const account = new Account({
    user_id: req.user.id.toString(),
    user_name: req.user.kakao_account.profile.nickname,
    email: req.user.kakao_account.email,
    is_api: '2',
  });

  Account.kakao_auth(account, (err, id, isRegister) => {
    if (err) {
      const message =
        err.message || 'Some error occurred while creating Account.';
      const success = 0;
      res.redirect(
        `memcaps://account/kakao_auth?message=${message}/success=${success}`,
      );
    } else {
      const user_id = account.user_id;
      const success = 1;
      res.redirect(
        `memcaps://account/kakao_auth?user_id=${user_id}/success=${success}/isRegister=${isRegister}/email=${account.email}`,
      );
    }
  });
};

const email_verification = (req, res) => {
  const email = req.body.email;
  Account.email_verification(email, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Some error occurred while creating Account.',
        success: 0,
      });
    else {
      res.json({success: 1, verification_code: data});
    }
  });
};

const find_id = (req, res) => {
  const email = req.query.email;
  Account.find_id(email, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Some error occurred finding ID.',
        success: 0,
      });
    else {
      res.json({success: 1, user_id: data.user_id, is_api: data.is_api});
    }
  });
};

const find_password = (req, res) => {
  const email = req.query.email;
  Account.find_password(email, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Some error occurred finding Password.',
        success: 0,
      });
    else {
      res.json({success: 1, email: email, password: data});
    }
  });
};

const change_password = (req, res) => {
  const user_id = req.body.user_id;
  const old_password = req.body.old_password;
  const new_password = req.body.new_password;
  Account.change_password(user_id, old_password, new_password, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Some error occurred changing Password.',
        success: 0,
      });
    else {
      res.json({success: 1});
    }
  });
};

const user_info = (req, res) => {
  const user_id = req.query.user_id;
  Account.user_info(user_id, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Some error occurred changing Password.',
        success: 0,
      });
    else {
      res.json(data);
    }
  });
};

const check_email = (req, res) => {
  const user_email = req.body.email;
  Account.check_email(user_email, (err, is_duplication) => {
    if (err)
      res.status(500).send({
        message: 'Some error occurred check email.',
        success: 0,
      });
    else{
      res.json({is_duplication: is_duplication, });
    }
  });
};

const withdraw = (req, res) => {
  const user_id = req.body.user_id;
  Account.withdraw(user_id, (err, success) => {
    if (err)
      res.status(500).send({
        message: 'Some error occurred withdraw user.',
        success: 0,
      });
    else{
      res.json({success: success, });
    }
  })
}

const profile = (req, res) => {
  Account.profile(req.body.user_id, req.file.location, (err, data) => {
    if (err)
      res.status(500).send({
        message: 'Some error occurred profile.',
        success: 0,
      });
    else{
      res.json({uri: data, });
    }
  })
}

const save_range_percent = (req, res) => {
  Account.save_range_percents(req.body.user_id, req.body.range_percent, req.body.measure_count, (err, data) => {
    if (err)
      res.status(500).send({
        message: 'Some error occurred.',
        success: 0,
      });
    else{
      res.json(1);
    }
  })
}

const load_range_percent = (req, res) => {
  Account.load_range_percents(req.body.user_id, (err,data) => {
    if (err)
      res.status(500).send({
        message: 'Some error occurred.',
        success: 0,
      });
    else{
      res.json(data);
    }
  })
}

const load_measure_count = (req,res)=> {
  Account.load_measure_counts(req.body.user_id, (err, data) => {
    if (err)
      res.status(500).send({
        message: 'Some error occurred.',
        success: 0,
      });
    else{
      res.json(data);
    }
  })
}

module.exports = {
  email_register,
  account_update,
  account_login,
  google_auth,
  google_auth_redirect,
  google_auth_passport,
  kakao_auth_passport,
  email_verification,
  find_id,
  find_password,
  change_password,
  user_info,
  check_email,
  withdraw,
  profile,
  save_range_percent,
  load_range_percent,
  load_measure_count,
};
