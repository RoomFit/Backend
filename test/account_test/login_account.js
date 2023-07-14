const data = {
  email: 'jerry7780@naver.com',
  password: '1234',
};

console.log(JSON.stringify(data));

fetch('http://localhost:4000/account/login', {
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
