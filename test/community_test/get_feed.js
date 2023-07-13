fetch('http://localhost:4000/community/', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
})
  .then(response => response.json())
  .then(responseData => {
    console.log('Response:', responseData);
  })
  .catch(error => {
    console.error('Error:', error);
  });
