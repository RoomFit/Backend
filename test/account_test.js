fetch('http://127.0.0.1:4000/account/update',{
    method: "PUT",
    headers:{
        'Content-type' : 'application/json'
    },
    body: JSON.stringify({
        user_id: "user1",
        set_break:15
    })
}).then(console.log("."))