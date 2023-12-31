const express = require('express');
const talkerRoute = require('./routes/talkerRoute');
const loginRoute = require('./routes/loginRoute');
const connection = require('./db/connection');

const app = express();
app.use(express.json());
app.use('/talker', talkerRoute);
app.use('/login', loginRoute);

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, async () => {
  const [result] = await connection.execute('SELECT 1');
  if (result) {
    console.log('MySQL connection OK');
  }

  console.log('Online');
});
