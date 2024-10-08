const db = require('../db/connect');
const nodemailer = require('nodemailer');
require('dotenv').config();

const Account = function (user) {
  this.user_id = user.user_id;
  this.password = user.password;
  this.user_name = user.user_name;
  this.email = user.email;
  this.is_api = user.is_api;
  this.birth = user.birth;
  this.gender = user.gender;
  this.height = user.height;
  this.weight = user.weight;
  this.experience = user.experience;
  this.body_fat = user.body_fat;
  this.set_break= user.set_break;
  this.motion_break= user.motion_break;
  this.uri = user.uri;
  this.range_percent = user.range_percent;
  this.measure_count = user.measure_count;
};

//Create User in email create mode
Account.create = (new_user, callback) => {
  const {user_id, password, user_name, email} = new_user;

  // 중복 체크를 위해 user_id와 email을 검색
  db.get(
    `SELECT user_id, email FROM User WHERE user_id = ?`,
    [user_id],
    function (err, row) {
      if (err) {
        console.error(err);
        callback(err);
        return;
      }

      if (row) {
        // 이미 존재하는 user_id 또는 email인 경우 에러를 반환
        //let error = new Error();
        let e = 0;
        if (row.user_id === user_id) {
          //error.message = '이미 사용 중인 ID입니다.';
          e = -1; // ID 중복인 경우
        } else if (row.email === email) {
          //error.message = '이미 사용 중인 이메일입니다.';
          e = -2; // 이메일 중복인 경우
        }
        callback(null, e);
        return;
      }

      // 중복된 ID나 이메일이 없는 경우 새로운 사용자를 생성
      db.run(
        `INSERT INTO User (user_id, password, user_name, email, is_api) VALUES (?,?,?,?,?)`,
        [user_id, password, user_name, email, 0],
        function (err) {
          if (err) {
            console.error(err);
            callback(err);
            return;
          }
          callback(null, 1);
        },
      );
    },
  );
};

Account.update = (new_account, callback) => {
  const user_id = new_account.user_id;
  //console.log(new_account);
  db.get(
    `SELECT * FROM User WHERE user_id = ?`,
    [user_id],
    function (err, row) {
      if (err) {
        console.error(err);
        callback(err);
        return;
      }

      if (!row) {
        let error = new Error();
        error.message = '존재하지 않는 ID입니다.';
        callback(error);
        return;
      }

      // Build the SQL UPDATE statement dynamically based on the fields present in new_account
      let updateQuery = 'UPDATE User SET';
      let updateParams = [];

      if (new_account.birth) {
        updateQuery += ' birthday = ?,';
        updateParams.push(new_account.birth);
      }

      if (new_account.gender) {
        updateQuery += ' gender = ?,';
        updateParams.push(new_account.gender);
      }

      if (new_account.height && new_account.weight) {
        updateQuery += ' height = ?, weight = ?,';
        updateParams.push(new_account.height, new_account.weight);
      }

      if (new_account.experience) {
        updateQuery += ' experience = ?,';
        updateParams.push(new_account.experience);
      }

      if (new_account.body_fat) {
        updateQuery += ' body_fat = ?,';
        updateParams.push(new_account.body_fat);
      }

      if (new_account.set_break) {
        updateQuery += ' set_break = ?,';
        updateParams.push(new_account.set_break);
      }

      if (new_account.motion_break) {
        updateQuery += ' motion_break = ?,';
        updateParams.push(new_account.motion_break);
      }

      if (new_account.user_name) {
        updateQuery += ' user_name = ?,';
        updateParams.push(new_account.user_name);
      }

      // 마지막 콤마 제거
      updateQuery = updateQuery.slice(0, -1);
      // user_id 추가
      updateQuery += ' WHERE user_id = ?';
      updateParams.push(user_id);

      db.run(updateQuery, updateParams, function (err, res) {
        if (err) {
          console.error(err);
          callback(err);
          return;
        }
        // Successful update
        //console.log(row);
        callback(null, row);
      });
    },
  );
};

Account.login = (user, callback) => {
  const {email, password} = user;
  db.get(
    `SELECT email, password, user_id, user_name FROM User WHERE email = ?`,
    [email],
    function (err, row) {
      if (err) {
        console.error(err);
        callback(err);
        return;
      }

      if (!row) {
        let error = new Error();
        error.message = '존재하지 않는 이메일입니다.';
        callback(error);
        return;
      }

      if (row.password !== password) {
        //let error = new Error();
        //error.message = '비밀번호가 일치하지 않습니다.';
        callback(null, {
          user_id: row.user_id,
          user_name: row.user_name,
          email: row.email,
          success: -2,
        });
        return;
      } else {
        //console.log(row);
        callback(null, {
          user_id: row.user_id,
          user_name: row.user_name,
          email: row.email,
          success: 1,
        });
      }
    },
  );
};

// Account.google_auth = (user, callback) => {
//   const {user_id, user_name, email, is_api} = user;

//   // 중복 체크를 위해 user_id와 email을 검색
//   db.get(
//     `SELECT user_id, email,is_api FROM User WHERE user_id = ?`,
//     [user_id],
//     function (err, row) {
//       if (err) {
//         console.error(err);
//         callback(err);
//         return;
//       }

//       if (row) {
//         console.log(row);
//         console.log(row.is_api);
//         if (row.is_api == 1) {
//           callback(null, this.lastID, 0);
//           return;
//         } else {
//           let error = new Error();
//           error.message = '이미 사용 중인 ID입니다.(이메일 회원가입)';
//           callback(error);
//           return;
//         }
//       }

//       // 중복된 ID나 이메일이 없는 경우 새로운 사용자를 생성
//       db.run(
//         `INSERT INTO User (user_id, user_name, email, is_api) VALUES (?,?,?,?)`,
//         [user_id, user_name, email, is_api],
//         function (err) {
//           if (err) {
//             console.error(err);
//             callback(err);
//             return;
//           }
//           callback(null, this.lastID, 1);
//         },
//       );
//     },
//   );
// };

Account.google_auth = (user, callback) => {
  const {user_id, user_name, email, is_api} = user;

  // 중복 체크를 위해 user_id와 email을 검색
  db.get(
    `SELECT user_id, email,is_api FROM User WHERE email = ?`,
    [email],
    function (err, row) {
      if (err) {
        console.error(err);
        callback(err);
        return;
      }
      if (row) {
        console.log(row);
        console.log(row.is_api);
        if (row.is_api === 1) {
          callback(null, row.user_id, 0);
          return;
        }
        else if (row.is_api === 0 && row.email === email) {
          const sql = `UPDATE user SET is_api = 1 WHERE email = ?`;
          db.run(sql, [email], function(err){
            if(err){
              callback(err);
              return;
            }
            callback(null, row.user_id, 0);
            return;
          })
        } 
        else {
          let error = new Error();
          error.message = '이미 사용 중인 ID입니다.(이메일 회원가입)';
          callback(error);
          return;
        }
      }

      // 중복된 ID나 이메일이 없는 경우 새로운 사용자를 생성
      db.run(
        `INSERT INTO User (user_id, user_name, email, is_api) VALUES (?,?,?,?)`,
        [user_id, user_name, email, is_api],
        function (err) {
          if (err) {
            console.error(err);
            callback(err);
            return;
          }
          callback(null, user_id, 1);
        },
      );
    },
  );
};

Account.kakao_auth = (user, callback) => {
  const {user_id, user_name, email, is_api} = user;
  // 중복 체크를 위해 user_id와 email을 검색
  db.get(
    `SELECT user_id, email,is_api FROM User WHERE user_id = ?`,
    [user_id],
    function (err, row) {
      if (err) {
        console.error(err);
        callback(err);
        return;
      }

      if (row) {
        console.log(row);
        console.log(row.is_api);
        if (row.is_api == 2) {
          callback(null, this.lastID, 0);
          return;
        } else {
          let error = new Error();
          error.message = '이미 사용 중인 ID입니다.(이메일 회원가입)';
          callback(error);
          return;
        }
      }

      // 중복된 ID나 이메일이 없는 경우 새로운 사용자를 생성
      db.run(
        `INSERT INTO User (user_id, user_name, email, is_api) VALUES (?,?,?,?)`,
        [user_id, user_name, email, is_api],
        function (err) {
          if (err) {
            console.error(err);
            callback(err);
            return;
          }
          callback(null, this.lastID, 2);
        },
      );
    },
  );
};

//추후 ejs 연동해서 더 이쁘게 보내기
Account.email_verification = (email, callback) => {
  const verification_code =
    Math.floor(Math.random() * (999999 - 111111 + 1)) + 111111;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.google.com',
    port: 587,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: process.env.GMAIL_USER,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: '[RoomFit] 이메일 인증 코드입니다.',
    text:
      '회원 가입을 위한 인증번호입니다.\n 아래의 인증번호를 입력하여 인증을 완료해주세요.\n' +
      verification_code,
  };

  transporter.sendMail(mailOptions, function (error, res) {
    if (error) {
      console.log(error);
      callback(error);
    } else {
      console.log('Email sent: ' + res.response);
      callback(null, verification_code);
    }
    transporter.close();
  });
};

Account.find_id = (email, callback) => {
  db.get(
    `SELECT user_id,is_api FROM User WHERE email = ?`,
    [email],
    function (err, row) {
      if (err) {
        console.error(err);
        callback(err);
        return;
      }

      if (!row) {
        let error = new Error();
        error.message = '존재하지 않는 이메일입니다.';
        callback(error);
        return;
      }
      callback(null, {user_id: row.user_id, is_api: row.is_api});
    },
  );
};

Account.find_password = (email, callback) => {
  db.get(
    `SELECT user_id,is_api FROM User WHERE email = ?`,
    [email],
    function (err, row) {
      if (err) {
        console.error(err);
        callback(err);
        return;
      }
      if (!row) {
        let error = new Error();
        error.message = '존재하지 않는 이메일입니다.';
        callback(error);
        return;
      } else {
        if (row.is_api != 0) {
          let error = new Error();
          error.message = '간편로그인 회원은 비밀번호를 변경할 수 없습니다.';
          callback(error);
          return;
        } else {
          const tmpPassword = Math.random().toString(36).substr(2, 10);
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.google.com',
            port: 587,
            secure: true,
            auth: {
              type: 'OAuth2',
              user: process.env.GMAIL_USER,
              clientId: process.env.GMAIL_CLIENT_ID,
              clientSecret: process.env.GMAIL_CLIENT_SECRET,
              refreshToken: process.env.GMAIL_REFRESH_TOKEN,
            },
          });

          const mailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: '[RoomFit] 임시 비밀번호',
            text: '임시 비밀번호 : ' + tmpPassword,
          };

          transporter.sendMail(mailOptions, function (error, res) {
            if (error) {
              console.log(error);
              callback(error);
            } else {
              console.log('Email sent: ' + res.response);

              db.run(
                `UPDATE User SET password = ? WHERE email = ?`,
                [tmpPassword, email],
                function (err, res) {
                  if (err) {
                    console.error(err);
                    callback(err);
                    return;
                  }
                },
              );

              callback(null, tmpPassword);
            }
            transporter.close();
          });
        }
      }
    },
  );
};

Account.change_password = (user_id, old_password, new_password, callback) => {
  console.log(user_id);

  db.get(
    `SELECT user_id, password FROM User WHERE user_id = ?`,
    [user_id],
    function (err, row) {
      if (err) {
        console.error(err);
        callback(err);
        return;
      }
      if (!row) {
        let error = new Error();
        error.message = '존재하지 않는 ID입니다.';
        callback(error);
        return;
      }
      if (row.password != old_password) {
        let error = new Error();
        error.message = '비밀번호가 일치하지 않습니다.';
        callback(error);
        return;
      } else {
        db.run(
          `UPDATE User SET password = ? WHERE user_id = ?`,
          [new_password, user_id],
          function (err) {
            if (err) {
              console.error(err);
              callback(err);
              return;
            }
            callback(null, this.changes);
          },
        );
      }
    },
  );
};

Account.user_info = (user_id, callback) => {
  db.get(
    `SELECT * FROM User WHERE user_id = ?`,
    [user_id],
    function (err, row) {
      if (err) {
        console.error(err);
        callback(err);
        return;
      }
      if (!row) {
        let error = new Error();
        error.message = '존재하지 않는 ID입니다.';
        callback(error);
        return;
      } else {
        callback(null, row);
      }
    },
  );
};

Account.check_email = (email, callback) => {
  db.get(
    `SELECT * FROM user WHERE email = ?`,
    [email],
    function(err, row) {
      if(err) {
        console.error(err);
        callback(err);
        return;
      }
      if(row){
        callback(null, 0);
      }
      else{
        callback(null, 1);
      }
    }
  )
}

Account.withdraw = (user_id, callback) => {
  const sql = 'DELETE FROM user where user_id =?';
  db.run(sql, [user_id], function (err, result) {
    if (err) console.error(err.message);
    else callback(null, 1);
  });
};

Account.profile = (user_id, location, callback) => {
  const sql = `UPDATE user SET uri = ? WHERE user_id = ?`;
    db.run(sql, [location, user_id], function(err){
      if(err){
        callback(err);
        return;
      }
      callback(null, location);
      return;
    })
}

Account.save_range_percents = (user_id, range_percent, measure_count, callback) => {
  const sql = 'UPDATE user SET range_percent = ?, measure_count = ? WHERE user_id = ?';
  db.run(sql, [range_percent, measure_count, user_id], function(err){
    if(err){
      callback(err);
      return;
    }
    callback(null, 1);
    return;
  })
}

Account.load_range_percents = (user_id, callback) => {
  const sql = 'SELECT range_percent from user where user_id = ?';
  db.get(
    sql,
    [user_id],
    function(err, row) {
      if(err) {
        console.error(err);
        callback(err);
        return;
      }
      callback(null, row);
    }
  )
}

Account.load_measure_counts = (user_id, callback) => {
  const sql = 'SELECT measure_count from user where user_id = ?';
  db.get(
    sql,
    [user_id],
    function(err, row) {
      if(err) {
        console.error(err);
        callback(err);
        return;
      }
      callback(null, row);
    }
  )
}

module.exports = Account;
