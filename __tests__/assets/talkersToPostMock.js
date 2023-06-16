const talkersToPostMock = [
  {
    name: 'Zendaya Maree',
    age: 24,
    talk: { rate: 5, watchedAt: '25/09/2020' },
  },
  {
    name: 'Gabriel Vasconcelos',
    age: 32,
    talk: { rate: 4, watchedAt: '25/09/2020' },
  },
  {
    name: 'Alberto Martins',
    age: 35,
    talk: { rate: 5, watchedAt: '21/11/2020' },
  },
  {
    name: 'Vinicius do Santos',
    age: 28,
    talk: { rate: 3, watchedAt: '21/11/2020' },
  }
]

const generateRandomNumber = () => Math.floor(Math.random() * talkersToPostMock.length);

const getNewTalkers = () => {
  let counter = 0;
  const talkersToRegister = [];
  const qtdTalkersToPost = generateRandomNumber() + 1;

  while (counter < qtdTalkersToPost) {
    const possibleTalkerToRegister = talkersToPostMock[generateRandomNumber()];
    const index = talkersToRegister
      .findIndex((talkerToRegister) => talkerToRegister === possibleTalkerToRegister);

    if (index === -1) {
      talkersToRegister.push(possibleTalkerToRegister);
      counter += 1;
    }
  }
  return talkersToRegister;
}

module.exports = { getNewTalkers };