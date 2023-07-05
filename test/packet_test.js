const axios = require('axios');

// 패킷 불러오기
axios
    .post('http://localhost:4000/packet/load', {
        record_id: 1,
    })
    .then(res => console.log(res))
    .catch(err => console.error(err));

// // 패킷 저장하기
// axios
//     .post('http://127.0.0.1:4000/packet/save', {
//         record_id:1,
//         time:1.0,
//         left:1.5,
//         right:1.4,
//     })
//     .then(res => console.log(res))
//     .catch(err => console.error(err));