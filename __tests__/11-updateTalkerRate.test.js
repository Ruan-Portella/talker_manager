const frisby = require('frisby');
const fs = require('fs');
const path = require('path');

const url = 'http://localhost:3001';
const TALKER_FILE = path.join(__dirname, '..', 'src', 'talker.json');
const SEED_FILE = path.join(__dirname, 'seed.json');

describe('11 - Crie o endpoint PATCH `/talker/rate/:id`', () => {
  beforeEach(() => {
    const talkerMock = fs.readFileSync(
      SEED_FILE,
      'utf8',
    );

    fs.writeFileSync(
      TALKER_FILE,
      talkerMock,
      'utf8',
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

  it('Será validado que não é possível alterar a avaliação de uma pessoa palestrante sem estar autorizado', async () => {
    let resultTalker;

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
            name: 'Zendaya Maree',
            age: 24,
            talk: {
              watchedAt: '25/09/2020',
              rate: 5,
            },
          })
          .expect('status', 201)
          .then((responseCreate) => {
            const { body } = responseCreate;
            resultTalker = JSON.parse(body);
          });
      });

    await frisby
      .post(`${url}/login`, {
        body: {
          email: 'deferiascomigo@gmail.com',
          password: '12345678',
        },
      })
      .then(() =>
        frisby
          .patch(`${url}/talker/rate/${resultTalker.id}`, {
            rate: 4,
          })
          .expect('status', 401)
          .then((responseUpdate) => {
            const { json } = responseUpdate;
            expect(json.message).toBe('Token não encontrado');
          }),
      );
  });

  it('Será validado que não é possível alterar a avaliação de uma pessoa palestrante com token inválido', async () => {
    const invalidTokens = [99999999, '99999999', '99999999999999', '99999999999999999'];

    for (let i = 0; i < invalidTokens.length; i++) {
      await frisby
        .setup({
          request: {
            headers: {
              Authorization: invalidTokens[i],
              'Content-Type': 'application/json',
            },
          },
        })
        .patch(`${url}/talker/rate/1`, {
          rate: 4,
        })
        .expect('status', 401)
        .then((responseUpdate) => {
          const { json } = responseUpdate;
          expect(json.message).toBe('Token inválido');
        });
    }
  });

  it('Será validado que não é possível alterar a avaliação de uma pessoa palestrante sem a chave rate', async () => {
    let resultTalker;

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
            name: 'Zendaya Maree',
            age: 24,
            talk: {
              watchedAt: '25/09/2020',
              rate: 5,
            },
          })
          .expect('status', 201)
          .then((responseCreate) => {
            const { body } = responseCreate;
            resultTalker = JSON.parse(body);
          });
      });

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
          .patch(`${url}/talker/rate/${resultTalker.id}`, {})
          .expect('status', 400)
          .then((responseUpdate) => {
            const { json } = responseUpdate;
            expect(json.message).toBe(
              'O campo "rate" é obrigatório',
            );
          });
      });
  });

  it('Será validado que não é possível alterar a avaliação de uma pessoa palestrante com rate negativo', async () => {
    let resultTalker;

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
            name: 'Zendaya Maree',
            age: 24,
            talk: {
              watchedAt: '25/09/2020',
              rate: 5,
            },
          })
          .expect('status', 201)
          .then((responseCreate) => {
            const { body } = responseCreate;
            resultTalker = JSON.parse(body);
          });
      });

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
          .patch(`${url}/talker/rate/${resultTalker.id}`, {
            rate: -1,
          })
          .expect('status', 400)
          .then((responseUpdate) => {
            const { json } = responseUpdate;
            expect(json.message).toBe(
              'O campo "rate" deve ser um número inteiro entre 1 e 5',
            );
          });
      });
  });

  it('Será validado que não é possível alterar a avaliação de uma pessoa palestrante com rate igual a zero', async () => {
    let resultTalker;

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
            name: 'Zendaya Maree',
            age: 24,
            talk: {
              watchedAt: '25/09/2020',
              rate: 5,
            },
          })
          .expect('status', 201)
          .then((responseCreate) => {
            const { body } = responseCreate;
            resultTalker = JSON.parse(body);
          });
      });

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
          .patch(`${url}/talker/rate/${resultTalker.id}`, {
            rate: 0,
          })
          .expect('status', 400)
          .then((responseUpdate) => {
            const { json } = responseUpdate;
            expect(json.message).toBe(
              'O campo "rate" deve ser um número inteiro entre 1 e 5',
            );
          });
      });
  });

  it('Será validado que não é possível alterar a avaliação de uma pessoa palestrante com rate maior que 5', async () => {
    let resultTalker;

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
            name: 'Zendaya Maree',
            age: 24,
            talk: {
              watchedAt: '25/09/2020',
              rate: 5,
            },
          })
          .expect('status', 201)
          .then((responseCreate) => {
            const { body } = responseCreate;
            resultTalker = JSON.parse(body);
          });
      });

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
          .patch(`${url}/talker/rate/${resultTalker.id}`, {
            rate: 6,
          })
          .expect('status', 400)
          .then((responseUpdate) => {
            const { json } = responseUpdate;
            expect(json.message).toBe(
              'O campo "rate" deve ser um número inteiro entre 1 e 5',
            );
          });
      });
  });

  it('Será validado que não é possível alterar a avaliação de uma pessoa palestrante com rate com número decimal', async () => {
    let resultTalker;

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
            name: 'Zendaya Maree',
            age: 24,
            talk: {
              watchedAt: '25/09/2020',
              rate: 5,
            },
          })
          .expect('status', 201)
          .then((responseCreate) => {
            const { body } = responseCreate;
            resultTalker = JSON.parse(body);
          });
      });

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
          .patch(`${url}/talker/rate/${resultTalker.id}`, {
            rate: 4.5,
          })
          .expect('status', 400)
          .then((responseUpdate) => {
            const { json } = responseUpdate;
            expect(json.message).toBe(
              'O campo "rate" deve ser um número inteiro entre 1 e 5',
            );
          });
      });
  });

  it('Será validado que é possível alterar a avaliação de uma pessoa palestrante com sucesso', async () => {
    let resultTalker;

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
            name: 'Zendaya Maree',
            age: 24,
            talk: {
              watchedAt: '25/09/2020',
              rate: 5,
            },
          })
          .expect('status', 201)
          .then((responseCreate) => {
            const { body } = responseCreate;
            resultTalker = JSON.parse(body);
          });
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
          .patch(`${url}/talker/rate/${resultTalker.id}`, {
            rate: 4,
          })
          .expect('status', 204)
          .expectNot('json', { result: "A requisição não deve retornar um corpo" })
      });
  });

  it('Será validado que os dados atualizados da pessoa palestrante sejam persistidos', async () => {
    let resultTalker;

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
            name: 'Zendaya Maree',
            age: 24,
            talk: {
              watchedAt: '25/09/2020',
              rate: 5,
            },
          })
          .expect('status', 201)
          .then((responseCreate) => {
            const { body } = responseCreate;
            resultTalker = JSON.parse(body);
          });
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
          .patch(`${url}/talker/rate/${resultTalker.id}`, {
            rate: 4,

          })
          .expect('status', 204)
          .then((responseUpdate) => {
            expect(require(TALKER_FILE)).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  id: resultTalker.id,
                  name: 'Zendaya Maree',
                  age: 24,
                  talk: {
                    watchedAt: '25/09/2020',
                    rate: 4,
                  },
                }),
              ]),
            );
          });
      });
  });
});
