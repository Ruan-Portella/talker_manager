const frisby = require('frisby');
const { resetDb, addTalker, removeTalkers } = require('./assets/utils');
const talkersSeed = require('./seed.json');

const url = 'http://localhost:3001';

describe('12 - Crie o endpoint GET `/talker/db`', () => {
  beforeEach(async () => { await resetDb(); });

  afterAll(async () => { await resetDb(); });

  it('Será validado que o endpoint retorna um array com todas as pessoas palestrantes cadastradas', async () => {
    await frisby
      .get(`${url}/talker/db`)
      .expect('status', 200)
      .then((responseGet) => {
        const { json } = responseGet;
        expect(json).toEqual(talkersSeed);
      });
  });

  it('Será validado que o endpoint retorna um array vazio caso não haja pessoas palestrantes cadastradas', async () => {
    await removeTalkers();

    await frisby
      .get(`${url}/talker/db`)
      .expect('status', 200)
      .then((responseGet) => {
        const { json } = responseGet;
        expect(json).toEqual([]);
      });
  });

  it('Será validado que o endpoint retorna um array atualizado caso seja cadastrada uma nova pessoa palestrante na DB', async () => {  
    await addTalker();
    
    await frisby
      .get(`${url}/talker/db`)
      .expect('status', 200)
      .then((responseGet) => {
        const { json } = responseGet;
        expect(json).toEqual([...talkersSeed, {
          id: 5,
          name: 'Zendaya Maree',
          age: 17,
          talk: { rate: 5, watchedAt: '25/09/2020' },
        }]);
      });
  });
});
