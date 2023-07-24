const email = 'jerry7780@g.skku.edu';
const url = `http://localhost:4000/account/find-password?email=${encodeURIComponent(
  email
)}`;

fetch(url, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
})
  .then((response) => response.json())
  .then((responseData) => {
    console.log('Response:', responseData);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
