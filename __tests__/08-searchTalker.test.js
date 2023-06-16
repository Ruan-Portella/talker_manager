const frisby = require('frisby');
const fs = require('fs');
const path = require('path');
const talkersSeed = require('./seed.json');

const url = 'http://localhost:3001';
const TALKER_FILE = path.join(__dirname, '..', 'src', 'talker.json');
const SEED_FILE = path.join(__dirname, 'seed.json');

describe('8 - Crie o endpoint GET `/talker/search` e o parâmetro de consulta `q=searchTerm`', () => {
  beforeEach(() => {
    const talkerSeed = fs.readFileSync(SEED_FILE, 'utf8');

    fs.writeFileSync(TALKER_FILE, talkerSeed, 'utf8');
  });

  afterAll(() => {
    const talkerSeed = fs.readFileSync(SEED_FILE, 'utf8');
    fs.writeFileSync(TALKER_FILE, talkerSeed, 'utf8');
  });

  it('Será validado que é possível fazer uma busca por termo com sucesso', async () => {
    await frisby
      .post(`${url}/login`, {
        email: 'deferiascomigo@gmail.com',
        password: '12345678',
      })
      .expect('status', 200)
      .then((responseLogin) => {
        const { body } = responseLogin;
        const result = JSON.parse(body);
        return frisby
          .setup({
            request: {
              headers: {
                Authorization: result.token,
                'Content-Type': 'application/json',
              },
            },
          })
          .post(`${url}/talker`, {
            name: 'Miley Cyrus',
            age: 27,
            talk: {
              watchedAt: '25/09/2020',
              rate: 4,
            },
          })
          .expect('status', 201);
      });

    await frisby
      .post(`${url}/login`, {
        email: 'deferiascomigo@gmail.com',
        password: '12345678',
      })
      .expect('status', 200)
      .then((responseLogin) => {
        const { body } = responseLogin;
        const result = JSON.parse(body);
        return frisby
          .setup({
            request: {
              headers: {
                Authorization: result.token,
                'Content-Type': 'application/json',
              },
            },
          })
          .get(`${url}/talker/search?q=M`)
          .expect('status', 200)
          .then((responseGet) => {
            const { json } = responseGet;
            expect(json).toStrictEqual([
              {
                name: 'Marcos Costa',
                age: 24,
                id: 4,
                talk: { watchedAt: '30/10/2020', rate: 5 },
              },
              {
                name: 'Miley Cyrus',
                id: 6,
                age: 27,
                talk: {
                  watchedAt: '25/09/2020',
                  rate: 4,
                },
              },
            ]);
          });
      });
  });

  it('Será validado que não é possível fazer uma busca por termo sem estar autorizado', async () => {
    await frisby
      .post(`${url}/login`, {
        body: {
          email: 'deferiascomigo@gmail.com',
          password: '12345678',
        },
      })
      .then(() =>
        frisby
          .setup()
          .get(`${url}/talker/search?q=Z`)
          .expect('status', 401)
          .then((responseGet) => {
            const { json } = responseGet;
            expect(json.message).toBe('Token não encontrado');
          }),
      );
  });

  it('Será validado que não é possível fazer uma busca por termo com token inválido', async () => {
    await frisby
      .post(`${url}/login`, {
        body: {
          email: 'deferiascomigo@gmail.com',
          password: '12345678',
        },
      })
      .then(() =>
        frisby
          .setup({
            request: {
              headers: {
                Authorization: '99999999999999999',
                'Content-Type': 'application/json',
              },
            },
          })
          .get(`${url}/talker/search?q=Ma`)
          .expect('status', 401)
          .then((responseGet) => {
            const { json } = responseGet;
            expect(json.message).toBe('Token inválido');
          }),
      );
  });

  it('Será validado que o endpoint retornará um array com todas as pessoas palestrantes caso param seja vazio', async () => {
    await frisby
      .post(`${url}/login`, {
        body: {
          email: 'deferiascomigo@gmail.com',
          password: '12345678',
        },
      })
      .then((responseLogin) => {
        const { body } = responseLogin;
        const result = JSON.parse(body);
        return frisby
          .setup({
            request: {
              headers: {
                Authorization: result.token,
                'Content-Type': 'application/json',
              },
            },
          })
          .get(`${url}/talker/search?q`)
          .expect('status', 200)
          .then((responseGet) => {
            const { json } = responseGet;
            expect(json).toEqual(talkersSeed);
          });
      });
  });

  it('Será validado que o endpoint retorna um array vazio caso o param não seja passado', async () => {
    fs.writeFileSync(TALKER_FILE, '[]', 'utf8');

    await frisby
      .post(`${url}/login`, {
        body: {
          email: 'deferiascomigo@gmail.com',
          password: '12345678',
        },
      })
      .then((responseLogin) => {
        const { body } = responseLogin;
        const result = JSON.parse(body);
        return frisby
          .setup({
            request: {
              headers: {
                Authorization: result.token,
                'Content-Type': 'application/json',
              },
            },
          })
          .get(`${url}/talker/search`)
          .expect('status', 200)
          .then((responseGet) => {
            const { json } = responseGet;
            expect(json).toEqual([]);
          });
      });
  });
});
