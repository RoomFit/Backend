const user_id = 'user1';
const url = `http://localhost:4000/account/user-info?user_id=${encodeURIComponent(
  user_id
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
