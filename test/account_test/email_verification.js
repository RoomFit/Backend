const data = {
  email: 'jerry7780@g.skku.edu',
};

console.log(JSON.stringify(data));

fetch('http://localhost:4000/account/email-verification', {
  method: 'POST',
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
