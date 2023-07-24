const data = {
  user_id: 'user1',
  old_password: '1234',
  new_password: '12345',
};

console.log(JSON.stringify(data));

fetch('http://localhost:4000/account/change_password', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
})
  .then((response) => response.json())
  .then((responseData) => {
    console.log('Response:', responseData);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
