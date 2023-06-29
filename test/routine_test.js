// //루틴 생성
// fetch('http://ec2-3-137-163-124.us-east-2.compute.amazonaws.com:4000/routine',{
//     method : "POST",
//     headers:{
//         'Content-type' : 'application/json'
//     },
//     body: JSON.stringify({
//         user_id: "user1"
//     })
// }).then(res=>res.json()).then(res=>{
//     console.log(res);
// });

// // 루틴 저장
// fetch('http://ec2-3-137-163-124.us-east-2.compute.amazonaws.com:4000/routine/save',{
//     method: "POST",
//     headers:{
//         'Content-type' : 'application/json'
//     },
//     body: JSON.stringify({
//         routine_id: 1,
//         motion_list: [
//           {
//             motion_id: 2,
//             sets: [{ weight: 30, reps: 20, mode: 1 }, { weight: 20, reps: 10, mode: 1 }]
//           },
//           {
//             motion_id: 2,
//             sets: [{ weight: 25, reps: 15, mode: 1 }, { weight: 60, reps: 10, mode: 1 }]
//           },
//           {
//             motion_id: 3,
//             sets: [{ weight: 15, reps: 15, mode: 1 }, { weight: 10, reps: 20, mode: 1 }, { weight: 70, reps: 5, mode: 1 }]
//           }
//         ]
//     })
// })

// // 루틴 간략히 보기(제한 O)
// fetch('http://127.0.0.1:4000/routine/load',{
//     method:"POST",
//     headers:{
//         'Content-type' : 'application/json'
//     },
//    body: JSON.stringify({
//        user_id: "user1",
//        isHome: true,     
//    })
// }).then(res=>res.json()).then(res=>{
//     console.log(res);
// });

// 전체 루틴 간략히 보기
fetch('http://127.0.0.1:4000/routine/load',{
    method:"POST",
    headers:{
        'Content-type' : 'application/json'
    },
    body: JSON.stringify({
        user_id: "user1",
        isHome: false,
    })
}).then(res=>res.json()).then(res=>{
    console.log(res);
});

// // 루틴 상세 보기
// const id = 29
// fetch('http://ec2-3-137-176-12.us-east-2.compute.amazonaws.com:4000/routine/detail/id',{
//     method:"GET"
// }).then(res=>res.json()).then(res=>{
//     console.log(res);
// });

// 루틴 삭제하기
// fetch('http://127.0.0.1:4000/routine/delete',{
//     method: "PUT",
//     headers:{
//         'Content-type' : 'application/json'
//     },
//     body: JSON.stringify({
//         routine_ids: [5,6]
//     })
// });



// 루틴 이름 수정
// fetch('http://127.0.0.1:4000/routine/nameChange',{
//     method: "PUT",
//     headers:{
//         'Content-type' : 'application/json'
//     },
//     body: JSON.stringify({
//         routine_id: 1, //
//         routine_name: "상체뽀개기"
//     })
// }).then(res=>res.json()).then(res=>{
//     console.log(res);
// });