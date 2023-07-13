fetch('http://localhost:4000/account/google-auth', {
  method: 'GET',
})
  .then((response) => response)
  .then((responseData) => {
    console.log('Response:', responseData);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
