const axios = require('axios');

// // 새로운 운동 기록 생성 테스트
// axios
//   .post('http://localhost:4000/workout', {user_id: 'user1'})
//   .then(res => {
//     console.log(res);
//   })
//   .catch(err => {
//     console.error(err);
//   });

// // 운동 종료 테스트
// setTimeout(() => {
//   axios
//     .put('http://localhost:4000/workout/done', {
//       workout_id: 8,
//       tut: '00:45:00',
//       title: '5일차 운동',
//       memo: '균형 안 맞는듯.',
//     })
//     .then(res => {
//       console.log(res);
//     })
//     .catch(err => {
//       console.error(err);
//     });
//   console.log('운동 종료');
// }, 7000);

// axios
//   .delete('http://localhost:4000/workout/delete/2')
//   .then(res => {
//     console.log(res);
//   })
//   .catch(err => {
//     console.error(err);
//   });

// axios
//   .post('http://127.0.0.1:4000/workout/brief/true', {
//     user_id: 'user1',
//   })
//   .then(res => {
//     console.log(res.data);
//   })
//   .catch(err => {
//     console.error(err);
//   });

// axios
//   .post('http://127.0.0.1:4000/workout/calender/month', {
//     user_id: 'user1',
//     month: '2023-06'
//   })
//   .then(res => {
//     console.log(res.data);
//   })
//   .catch(err => {
//     console.error(err);
//   });

// axios
//   .post('http://127.0.0.1:4000/workout/calender/date', {
//     user_id: 'user1',
//     date: '2023-06-29'
//   })
//   .then(res => {
//     console.log(res.data);
//   })
//   .catch(err => {
//     console.error(err);
//   });
// axios
//   .post('http://localhost:4000/workout/brief/recent', {
//     user_id: 'user1',
//     month: '2023-06',
//   })
//   .then(res => {
//     console.log(res.data);
//   })
//   .catch(err => {
//     console.error(err);
//   });
