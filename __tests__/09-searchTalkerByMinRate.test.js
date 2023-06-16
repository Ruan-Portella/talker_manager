const frisby = require('frisby');
const fs = require('fs');
const path = require('path');
const talkersSeed = require('./seed.json');

const url = 'http://localhost:3001';
const TALKER_FILE = path.join(__dirname, '..', 'src', 'talker.json');
const SEED_FILE = path.join(__dirname, 'seed.json');

describe('9 - Crie no endpoint GET `/talker/search` o parâmetro de consulta `rate=rateNumber`', () => {
  beforeEach(() => {
    const talkerSeed = fs.readFileSync(SEED_FILE, 'utf8');

    fs.writeFileSync(TALKER_FILE, talkerSeed, 'utf8');
  });

  afterAll(() => {
    const talkerSeed = fs.readFileSync(SEED_FILE, 'utf8');
    fs.writeFileSync(TALKER_FILE, talkerSeed, 'utf8');
  });

  it('Será validado que é possível fazer uma busca por avaliação com sucesso', async () => {
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
          .get(`${url}/talker/search?rate=5`)
          .expect('status', 200)
          .then((responseGet) => {
            const { json } = responseGet;
            expect(json).toStrictEqual([
              {
                name: 'Henrique Albuquerque',
                age: 62,
                id: 1,
                talk: {
                  watchedAt: '22/10/2020',
                  rate: 5,
                },
              },
              {
                name: 'Marcos Costa',
                age: 24,
                id: 4,
                talk: {
                  watchedAt: '30/10/2020',
                  rate: 5,
                },
              },
              {
                name: 'Henrique dos Santos',
                age: 44,
                id: 5,
                talk: {
                  watchedAt: '29/10/2020',
                  rate: 5,
                },
              },
            ]);
          });
      });
  });

  it('Será validado que não é possível fazer uma busca por avaliação sem estar autorizado', async () => {
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
          .get(`${url}/talker/search?rate=4`)
          .expect('status', 401)
          .then((responseGet) => {
            const { json } = responseGet;
            expect(json.message).toBe('Token não encontrado');
          }),
      );
  });

  it('Será validado que não é possível fazer uma busca por avaliação com token inválido', async () => {
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
          .get(`${url}/talker/search?rate=5`)
          .expect('status', 401)
          .then((responseGet) => {
            const { json } = responseGet;
            expect(json.message).toBe('Token inválido');
          }),
      );
  });

  it('Será validado que não é possível fazer uma busca por avaliação caso o termo pesquisado no queryParam `rate` não seja um número', async () => {
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
          .get(`${url}/talker/search?rate=Excelente`)
          .expect('status', 400)
          .then((responseGet) => {
            const { json } = responseGet;
            expect(json.message).toBe(
              'O campo "rate" deve ser um número inteiro entre 1 e 5',
            );
          });
      });
  });

  it('Será validado que não é possível fazer uma busca por avaliação caso o termo pesquisado no queryParam `rate` não seja um número inteiro', async () => {
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
          .get(`${url}/talker/search?rate=4.4`)
          .expect('status', 400)
          .then((responseGet) => {
            const { json } = responseGet;
            expect(json.message).toBe(
              'O campo "rate" deve ser um número inteiro entre 1 e 5',
            );
          });
      });
  });

  it('Será validado que não é possível fazer uma busca por avaliação caso o termo pesquisado no queryParam rate seja um número menor do que 1', async () => {
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
          .get(`${url}/talker/search?rate=0`)
          .expect('status', 400)
          .then((responseGet) => {
            const { json } = responseGet;
            expect(json.message).toBe(
              'O campo "rate" deve ser um número inteiro entre 1 e 5',
            );
          });
      });
  });

  it('Será validado que não é possível fazer uma busca por avaliação caso o termo pesquisado no queryParam rate seja um número maior do que 5', async () => {
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
          .get(`${url}/talker/search?rate=6`)
          .expect('status', 400)
          .then((responseGet) => {
            const { json } = responseGet;
            expect(json.message).toBe(
              'O campo "rate" deve ser um número inteiro entre 1 e 5',
            );
          });
      });
  });

  it('Será validado que é possível fazer uma busca combinando os queryParams "q" e "rate" com sucesso', async () => {
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
          .get(`${url}/talker/search?q=He&rate=5`)
          .expect('status', 200)
          .then((responseGet) => {
            const { json } = responseGet;
            expect(json).toStrictEqual([
              {
                name: 'Henrique Albuquerque',
                age: 62,
                id: 1,
                talk: {
                  watchedAt: '22/10/2020',
                  rate: 5,
                },
              },
              {
                name: 'Henrique dos Santos',
                age: 44,
                id: 5,
                talk: {
                  watchedAt: '29/10/2020',
                  rate: 5,
                },
              },
            ]);
          });
      });
  });
});
