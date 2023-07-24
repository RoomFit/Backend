const data = {
  user_id: 'user1',
  feed_content: 'asdfaszzzz',
  image_url:
    'https://mblogthumb-phinf.pstatic.net/MjAyMTAxMTNfMjQy/MDAxNjEwNTMxNzU0NDAw.dnT66RTVTyv0DURLa16orDdxHfYGkWw2fIf-VvkWZl0g.DLOrmXxdYsTEU_PaIgDXLBgvs9W4lWrvcA78aObeo0Mg.JPEG.sb02199/3.jpg?type=w800',
};

console.log(JSON.stringify(data));

fetch('http://localhost:4000/community/post-feed', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
})
  .then(response => response.json())
  .then(responseData => {
    console.log('Response:', responseData);
  })
  .catch(error => {
    console.error('Error:', error);
  });
