const frisby = require('frisby');
const fs = require('fs');
const path = require('path');

const url = 'http://localhost:3001';
const TALKER_FILE = path.join(__dirname, '..', 'src', 'talker.json');
const SEED_FILE = path.join(__dirname, 'seed.json');

describe('2 - Crie o endpoint GET /talker/:id', () => {
  beforeEach(() => {
    const talkerSeed = fs.readFileSync(SEED_FILE, 'utf8');

    fs.writeFileSync(TALKER_FILE, talkerSeed, 'utf8');
  });

  afterAll(() => {
    const talkerSeed = fs.readFileSync(SEED_FILE, 'utf8');
    fs.writeFileSync(TALKER_FILE, talkerSeed, 'utf8');
  });

  it('Será validado que o endpoint retorna uma pessoa palestrante com base no id da rota', async () => {
    await frisby
      .get(`${url}/talker/1`)
      .expect('status', 200)
      .then((responseGet) => {
        const { json } = responseGet;
        expect(json).toEqual({
          name: 'Henrique Albuquerque',
          age: 62,
          id: 1,
          talk: { watchedAt: '22/10/2020', rate: 5 },
        });
      });
  });

  it('Será validado que o endpoint retorna um erro caso nenhuma pessoa palestrante seja encontrada', async () => {
    await frisby
      .get(`${url}/talker/9`)
      .expect('status', 404)
      .then((responseGet) => {
        const { json } = responseGet;
        expect(json.message).toBe('Pessoa palestrante não encontrada');
      });
  });
});
