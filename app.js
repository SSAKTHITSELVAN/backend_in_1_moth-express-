import express from 'express';

const app = express();

function handler(req, res) {
  res.send('Hello World!');
}

app.get('/', handler);
app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});