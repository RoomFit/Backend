const data = {
  user_id: 'user1',
  user_name: 'hello',
};

console.log(JSON.stringify(data));

fetch('http://localhost:4000/account/update', {
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
