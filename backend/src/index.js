const express = require('express');
const { PORT } = process.env;
const { insertWord, runAhoCorasick, deleteWord, listAllWords } = require('./controller');
const db = require('./db');

const app = express();

app.use(express.json());

app.post('/insert', insertWord);
app.post('/query', runAhoCorasick);

app.delete('/delete', deleteWord);

app.get('/words', listAllWords);

db.init().then(() => {
  console.log('Database connected');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
