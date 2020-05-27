const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
  if (type === 'PostCreated') {
    const { id, title } = data;

    posts[id] = { id, title, comments: [] };
  }

  if (type === 'CommentCreated') {
    const { id, content, postId, status } = data;

    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  if (type === 'CommentUpdated') {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    const comment = post.comments.find((comment) => {
      return (comment.id = id);
    });
    comment.status = status;
    comment.content = content;
  }
};

//client will make a request to get all posts
app.get('/posts', (req, res) => {
  res.send(posts);
});

//store in a data structure the posts and their corresponding comments
app.post('/events', (req, res) => {
  const { type, data } = req.body;
  handleEvent(type, data);
  console.log(posts);
  res.send({});
});

app.listen(4002, async () => {
  console.log('Listening on 4002');
  const res = await axios.get('http://localhost:4005/events');
  //on start retrieve all of the events from the even bus
  for (let event of res.data) {
    console.log('Processing event: ', event.type);
    handleEvent(event.type, event.data);
  }
});
