const axios = require('axios');

//새로운 동작 시작 테스트
axios
  .post('http://localhost:4000/record', {
    workout_id: 2,
    motion_id: 2,
  })
  .then(res => console.log(res))
  .catch(err => console.error(err));

//Record 삭제
axios
  .delete('http://localhost:4000/record/delete/6')
  .then(res => console.log(res))
  .catch(err => console.error(err));
