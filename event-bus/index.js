const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

//receive event and chain propagate the event to different services
app.post('/events', (req, res) => {
  const event = req.body;
  //posts service
  axios.post('http://localhost:4000/events', event);
  //comments service
  axios.post('http://localhost:4001/events', event);
  //query service
  axios.post('http://localhost:4002/events', event);
  res.send({ status: 'OK' });
});

app.listen(4005, () => {
  console.log('listening on port 4005');
});