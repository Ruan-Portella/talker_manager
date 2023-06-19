const express = require('express');
const talkerRoute = require('./routes/talkerRoute');
const loginRoute = require('./routes/loginRoute');

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

app.listen(PORT, () => {
  console.log('Online');
});
