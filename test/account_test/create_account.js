const data = {
  user_id: 'asdfasdf123123',
  password: '1234',
  user_name: '정우석',
  email: 'msj5531123123@nate.com',
};

console.log(JSON.stringify(data));

fetch('http://ec2-3-137-176-12.us-east-2.compute.amazonaws.com:4000/account/register', {
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
