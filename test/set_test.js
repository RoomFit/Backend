const axios = require('axios');

//세트 종료 테스트
axios
  .post('http://localhost:4000/set', {
    record_id: 1,
    routine_motion_id: null,
    set_no: 1,
    weight: 15,
    rep: 10,
    mode: 1,
  })
  .then(res => console.log(res))
  .catch(err => console.error(err));

//루틴 세트 생성 테스트
// axios
//   .post('http://localhost:4000/set', {
//     record_id: null,
//     routine_motion_id: 1,
//     set_no: 1,
//     weight: 15,
//     rep: 10,
//     mode: 1,
//   })
//   .then(res => console.log(res))
//   .catch(err => console.error(err));
