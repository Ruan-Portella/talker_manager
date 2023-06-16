const frisby = require('frisby');
const fs = require('fs');
const path = require('path');
const talkersSeed = require('./seed.json');

const url = 'http://localhost:3001';
const TALKER_FILE = path.join(__dirname, '..', 'src', 'talker.json');
const SEED_FILE = path.join(__dirname, 'seed.json');

describe('1 - Crie o endpoint GET /talker', () => {
  beforeEach(() => {
    const talkerSeed = fs.readFileSync(
      SEED_FILE,
      'utf8'
    );

    fs.writeFileSync(
      TALKER_FILE,
      talkerSeed,
      'utf8'
    );

  });

  afterAll(() => {
    const talkerSeed = fs.readFileSync(
      SEED_FILE,
      'utf8'
    );
    fs.writeFileSync(
      TALKER_FILE,
      talkerSeed,
      'utf8',
    );
  });

  it('Será validado que o endpoint retorna um array com todos as pessoas palestrantes cadastradas', async () => {
    await frisby
      .get(`${url}/talker`)
      .expect('status', 200)
      .then((responseGet) => {
        const { json } = responseGet;
        expect(json).toEqual(talkersSeed);
      });
  });

  it('Será validado que o endpoint retorna um array vazio caso não haja pessoas palestrantes cadastradas', async () => {
    fs.writeFileSync(TALKER_FILE, '[]', 'utf8');

    await frisby
      .get(`${url}/talker`)
      .expect('status', 200)
      .then((responseGet) => {
        const { json } = responseGet;
        expect(json).toEqual([]);
      });
  });
});
