const axios = require('axios');

axios
  .post('http://localhost:4000/workout/stat/7', {user_id: 'user1'})
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.error(err);
  });
