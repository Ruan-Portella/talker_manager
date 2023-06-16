const frisby = require('frisby');
const fs = require('fs');
const path = require('path');
const talkersSeed = require('./seed.json');

const url = 'http://localhost:3001';
const TALKER_FILE = path.join(__dirname, '..', 'src', 'talker.json');
const SEED_FILE = path.join(__dirname, 'seed.json');

describe('10 - Crie no endpoint GET `/talker/search` o parâmetro de consulta `date=watchedDate`', () => {
  beforeEach(() => {
    const talkerSeed = fs.readFileSync(SEED_FILE, 'utf8');

    fs.writeFileSync(TALKER_FILE, talkerSeed, 'utf8');
  });

  afterAll(() => {
    const talkerSeed = fs.readFileSync(SEED_FILE, 'utf8');
    fs.writeFileSync(TALKER_FILE, talkerSeed, 'utf8');
  });

  it('Será validado que é possível fazer uma busca por data com sucesso', async () => {
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
          .get(`${url}/talker/search?date=22/10/2020`)
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
                name: 'Heloísa Albuquerque',
                age: 67,
                id: 2,
                talk: {
                  watchedAt: '22/10/2020',
                  rate: 4,
                },
              },
              {
                name: 'Ricardo Xavier Filho',
                age: 33,
                id: 3,
                talk: {
                  watchedAt: '22/10/2020',
                  rate: 3,
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
          .get(`${url}/talker/search?date=22/10/2020`)
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
          .get(`${url}/talker/search?date=22/10/2020`)
          .expect('status', 401)
          .then((responseGet) => {
            const { json } = responseGet;
            expect(json.message).toBe('Token inválido');
          }),
      );
  });

  it('Será validado que não é possível fazer uma busca por avaliação caso o termo pesquisado no queryParam `date` não respeite o formato "dd/mm/aaaa"', async () => {
    const dataTestArray = [
      '10-12-2020',
      '0/0/0',
      '12/8/22',
      '/10/',
      '25/12',
      '//',
      '030432',
      '02/jan/1990',
    ];

    const token = await frisby
      .post(`${url}/login`, {
        body: {
          email: 'deferiascomigo@gmail.com',
          password: '12345678',
        },
      })
      .then((responseLogin) => {
        const { json } = responseLogin;
        return json.token;
      });

    for (let i = 0; i < dataTestArray.length; i++) {
      await frisby
        .setup({
          request: {
            headers: {
              Authorization: token,
              'Content-Type': 'application/json',
            },
          },
        })
        .get(`${url}/talker/search?date=${dataTestArray[i]}`)
        .expect('status', 400)
        .then((responseCreate) => {
          const { json } = responseCreate;
          expect(json.message).toBe(
            'O parâmetro "date" deve ter o formato "dd/mm/aaaa"',
          );
        });
    }
  });

  it('Será validado que o endpoint retornará um array com todas as pessoas palestrantes caso o param `date` seja vazio', async () => {
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
          .get(`${url}/talker/search?date`)
          .expect('status', 200)
          .then((responseGet) => {
            const { json } = responseGet;
            expect(json).toEqual(talkersSeed);
          });
      });
  });

  it('Será validado que é possível fazer uma busca combinando os queryParams "date" e "rate" com sucesso', async () => {
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
          .get(`${url}/talker/search?date=22/10/2020&rate=4`)
          .expect('status', 200)
          .then((responseGet) => {
            const { json } = responseGet;
            expect(json).toStrictEqual([
              {
                name: 'Heloísa Albuquerque',
                age: 67,
                id: 2,
                talk: {
                  watchedAt: '22/10/2020',
                  rate: 4,
                },
              },
            ]);
          });
      });
  });

  it('Será validado que é possível fazer uma busca combinando os queryParams "date" e "q" com sucesso', async () => {
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
          .get(`${url}/talker/search?date=22/10/2020&q=He`)
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
                name: 'Heloísa Albuquerque',
                age: 67,
                id: 2,
                talk: {
                  watchedAt: '22/10/2020',
                  rate: 4,
                },
              },
            ]);
          });
      });
  });

  it('Será validado que é possível fazer uma busca combinando os queryParams "date", "rate" e "q" com sucesso', async () => {
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
          .get(`${url}/talker/search?date=22/10/2020&rate=5&q=He`)
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
            ]);
          });
      });
  });
});
