const frisby = require('frisby');
const fs = require('fs');
const path = require('path');
const { getNewTalkers } = require('./assets/talkersToPostMock');

const TALKER_FILE = path.join(__dirname, '..', 'src', 'talker.json');
const SEED_FILE = path.join(__dirname, 'seed.json');

const url = 'http://localhost:3001';

describe('5 - Crie o endpoint POST /talker', () => {
  beforeEach(() => {
    const talkerSeed = fs.readFileSync(
      SEED_FILE,
      'utf8',
    );

    fs.writeFileSync(
      TALKER_FILE,
      talkerSeed,
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

  it('Será validado que não é possível cadastrar uma pessoa palestrante sem estar autorizado', async () => {
    await frisby
      .post(`${url}/login`, {
        body: {
          email: 'deferiascomigo@gmail.com',
          password: '12345678',
        },
      })
      .then(() =>
        frisby
          .post(`${url}/talker`, {
            name: 'Zendaya Maree',
            age: 17,
            talk: { rate: 5, watchedAt: '25/09/2020' },
          })
          .expect('status', 401)
          .then((responseCreate) => {
            const { json } = responseCreate;
            expect(json.message).toBe('Token não encontrado');
          }),
      );
  });

  it('Será validado que não é possível cadastrar uma pessoa palestrante com token inválido', async () => {
    const invalidTokens = [99999999, '99999999', undefined, '123456789012345', '99999999999999999'];
    for (let i = 0; i < invalidTokens.length; i++) {
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
                  Authorization: invalidTokens[i],
                  'Content-Type': 'application/json',
                },
              },
            })
            .post(`${url}/talker`, {
              name: 'Zendaya Maree',
              age: 24,
              talk: { rate: 5, watchedAt: '20/10/2020' },
            })
            .expect('status', 401)
            .then((responseCreate) => {
              const { json } = responseCreate;
              expect(json.message).toBe('Token inválido');
            }),
        );
    }
  });

  it('Será validado que não é possível cadastrar uma pessoa palestrante sem nome', async () => {
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
          .post(`${url}/talker`, {
            age: 24,
            talk: { rate: 5, watchedAt: '25/09/2020' },
          })
          .expect('status', 400)
          .then((responseCreate) => {
            const { json } = responseCreate;
            expect(json.message).toBe('O campo "name" é obrigatório');
          });
      });
  });

  it('Será validado que não é possível cadastrar uma pessoa palestrante com nome menor que 3 caracteres', async () => {
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
          .post(`${url}/talker`, {
            name: 'Oi',
            age: 24,
            talk: { rate: 5, watchedAt: '25/09/2020' },
          })
          .expect('status', 400)
          .then((responseCreate) => {
            const { json } = responseCreate;
            expect(json.message).toBe(
              'O "name" deve ter pelo menos 3 caracteres',
            );
          });
      });
  });

  it('Será validado que não é possível cadastrar uma pessoa palestrante sem idade', async () => {
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
          .post(`${url}/talker`, {
            name: 'Zendaya Maree',
            talk: { rate: 5, watchedAt: '25/09/2020' },
          })
          .expect('status', 400)
          .then((responseCreate) => {
            const { json } = responseCreate;
            expect(json.message).toBe('O campo "age" é obrigatório');
          });
      });
  });

  it('Será validado que não é possível cadastrar uma pessoa palestrante se a idade for diferente do tipo number', async () => {
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
          .post(`${url}/talker`, {
            name: 'Zendaya Maree',
            age: "Dezoito",
            talk: { rate: 5, watchedAt: '25/09/2020' },
          })
          .expect('status', 400)
          .then((responseCreate) => {
            const { json } = responseCreate;
            expect(json.message).toBe(
              'O campo "age" deve ser um número inteiro igual ou maior que 18',
            );
          });
      });
  });

  it('Será validado que não é possível cadastrar uma pessoa palestrante se o valor da idade não for inteiro', async () => {
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
          .post(`${url}/talker`, {
            name: 'Zendaya Maree',
            age: 18.5,
            talk: { rate: 5, watchedAt: '25/09/2020' },
          })
          .expect('status', 400)
          .then((responseCreate) => {
            const { json } = responseCreate;
            expect(json.message).toBe(
              'O campo "age" deve ser um número inteiro igual ou maior que 18',
            );
          });
      });
  });


  it('Será validado que não é possível cadastrar uma pessoa palestrante com idade menor de 18 anos', async () => {
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
          .post(`${url}/talker`, {
            name: 'Zendaya Maree',
            age: 17,
            talk: { rate: 5, watchedAt: '25/09/2020' },
          })
          .expect('status', 400)
          .then((responseCreate) => {
            const { json } = responseCreate;
            expect(json.message).toBe(
              'O campo "age" deve ser um número inteiro igual ou maior que 18',
            );
          });
      });
  });

  it('Será validado que não é possível cadastrar uma pessoa palestrante sem o campo talk', async () => {
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
          .post(`${url}/talker`, {
            name: 'Zendaya Maree',
            age: 24,
          })
          .expect('status', 400)
          .then((responseCreate) => {
            const { json } = responseCreate;
            expect(json.message).toBe(
              'O campo "talk" é obrigatório',
            );
          });
      });
  });

  it('Será validado que não é possível cadastrar uma pessoa palestrante sem a chave watchedAt', async () => {
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
          .post(`${url}/talker`, {
            name: 'Zendaya Maree',
            age: 24,
            talk: { rate: 5 },
          })
          .expect('status', 400)
          .then((responseCreate) => {
            const { json } = responseCreate;
            expect(json.message).toBe(
              'O campo "watchedAt" é obrigatório',
            );
          });
      });
  });

  it('Será validado que não é possível cadastrar uma pessoa palestrante com watchedAt sem o formato "dd/mm/aaaa"', async () => {
    const dataTestArray = [
      '42-20-3333',
      '0/0/0',
      '12/7/25',
      '/11/',
      '01/12',
      '//',
      '010332',
      '02/mar/1988',
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
        .post(`${url}/talker`, {
          name: 'Zendaya Maree',
          age: 24,
          talk: { rate: 5, watchedAt: dataTestArray[i] },
        })
        .expect('status', 400)
        .then((responseCreate) => {
          const { json } = responseCreate;
          expect(json.message).toBe(
            'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"',
          );
        });
    }
  });

  it('Será validado que não é possível cadastrar uma pessoa palestrante sem a chave rate', async () => {
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
          .post(`${url}/talker`, {
            name: 'Zendaya Maree',
            age: 24,
            talk: { watchedAt: '25/09/2020' },
          })
          .expect('status', 400)
          .then((responseCreate) => {
            const { json } = responseCreate;
            expect(json.message).toBe(
              'O campo "rate" é obrigatório',
            );
          });
      });
  });

  it('Será validado que não é possível cadastrar uma pessoa palestrante com rate negativo', async () => {
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
          .post(`${url}/talker`, {
            name: 'Zendaya Maree',
            age: 24,
            talk: { rate: -1, watchedAt: '25/09/2020' },
          })
          .expect('status', 400)
          .then((responseCreate) => {
            const { json } = responseCreate;
            expect(json.message).toBe(
              'O campo "rate" deve ser um número inteiro entre 1 e 5',
            );
          });
      });
  });

  it('Será validado que não é possível cadastrar uma pessoa palestrante com rate igual a zero)', async () => {
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
          .post(`${url}/talker`, {
            name: 'Zendaya Maree',
            age: 24,
            talk: { rate: 0, watchedAt: '25/09/2020' },
          })
          .expect('status', 400)
          .then((responseCreate) => {
            const { json } = responseCreate;
            expect(json.message).toBe(
              'O campo "rate" deve ser um número inteiro entre 1 e 5',
            );
          });
      });
  });

  it('Será validado que não é possível cadastrar uma pessoa palestrante com rate maior que 5', async () => {
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
          .post(`${url}/talker`, {
            name: 'Zendaya Maree',
            age: 24,
            talk: { rate: 7, watchedAt: '25/09/2020' },
          })
          .expect('status', 400)
          .then((responseCreate) => {
            const { json } = responseCreate;
            expect(json.message).toBe(
              'O campo "rate" deve ser um número inteiro entre 1 e 5',
            );
          });
      });
  });
  
  it('Será validado que não é possível cadastrar uma pessoa palestrante com rate com número decimal', async () => {
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
          .post(`${url}/talker`, {
            name: 'Zendaya Maree',
            age: 24,
            talk: { rate: 2.5, watchedAt: '25/09/2020' },
          })
          .expect('status', 400)
          .then((responseCreate) => {
            const { json } = responseCreate;
            expect(json.message).toBe(
              'O campo "rate" deve ser um número inteiro entre 1 e 5',
            );
          });
      });
  });

  it('Será validado que é possível cadastrar uma pessoa palestrante com sucesso', async () => {
    const postTalkersMock = getNewTalkers();
    for (postTalkerMock of postTalkersMock) {
      const id = JSON.parse(fs.readFileSync(TALKER_FILE,'utf8')).length + 1
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
            .post(`${url}/talker`, postTalkerMock)
            .expect('status', 201)
            .then((responseCreate) => {
              postTalkerMock.id = id
              expect(JSON.parse(fs.readFileSync(
                TALKER_FILE,
                'utf8',
              ))).toEqual(
                expect.arrayContaining([expect.objectContaining(postTalkerMock)]),
              );
              const { json } = responseCreate;
              expect(json).toEqual(postTalkerMock);
            })
        })
    }
  });
});
