const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/books', require('./routes/books'));

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});