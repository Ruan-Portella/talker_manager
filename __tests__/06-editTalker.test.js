const frisby = require('frisby');
const fs = require('fs');
const path = require('path');

const url = 'http://localhost:3001';
const TALKER_FILE = path.join(__dirname, '..', 'src', 'talker.json');
const SEED_FILE = path.join(__dirname, 'seed.json');

describe('6 - Crie o endpoint PUT /talker/:id', () => {
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

  it('Será validado que não é possível editar uma pessoa palestrante sem estar autorizado', async () => {
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
          .put(`${url}/talker/${resultTalker.id}`, {
            name: 'Zendaya',
            age: 25,
            talk: {
              watchedAt: '24/10/2020',
              rate: 4,
            },
          })
          .expect('status', 401)
          .then((responseUpdate) => {
            const { json } = responseUpdate;
            expect(json.message).toBe('Token não encontrado');
          }),
      );
  });

  it('Será validado que não é possível editar uma pessoa palestrante com token inválido', async () => {
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
        .put(`${url}/talker/1`, {
          name: 'Zendaya',
          age: 25,
          talk: {
            watchedAt: '24/10/2020',
            rate: 4,
          },
        })
        .expect('status', 401)
        .then((responseUpdate) => {
          const { json } = responseUpdate;
          expect(json.message).toBe('Token inválido');
        });
    }
  });

  it('Será validado que não é possível editar uma pessoa palestrante sem nome', async () => {
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
          .put(`${url}/talker/${resultTalker.id}`, {
            age: 25,
            talk: {
              watchedAt: '24/10/2020',
              rate: 4,
            },
          })
          .expect('status', 400)
          .then((responseUpdate) => {
            const { json } = responseUpdate;
            expect(json.message).toBe('O campo "name" é obrigatório');
          });
      });
  });

  it('Será validado que não é possível editar uma pessoa palestrante com nome menor que 3 caracteres', async () => {
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
          .put(`${url}/talker/${resultTalker.id}`, {
            name: 'Ze',
            age: 25,
            talk: {
              watchedAt: '24/10/2020',
              rate: 4,
            },
          })
          .expect('status', 400)
          .then((responseUpdate) => {
            const { json } = responseUpdate;
            expect(json.message).toBe(
              'O "name" deve ter pelo menos 3 caracteres',
            );
          });
      });
  });

  it('Será validado que não é possível editar uma pessoa palestrante sem idade', async () => {
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
          .put(`${url}/talker/${resultTalker.id}`, {
            name: 'Zendaya',
            talk: {
              watchedAt: '24/10/2020',
              rate: 4,
            },
          })
          .expect('status', 400)
          .then((responseUpdate) => {
            const { json } = responseUpdate;
            expect(json.message).toBe('O campo "age" é obrigatório');
          });
      });
  });

  it('Será validado que não é possível cadastrar uma pessoa palestrante se a idade for diferente do tipo number', async () => {
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
          .put(`${url}/talker/${resultTalker.id}`, {
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
          .put(`${url}/talker/${resultTalker.id}`, {
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

  it('Será validado que não é possível editar uma pessoa palestrante com idade menor de 18 anos', async () => {
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
          .put(`${url}/talker/${resultTalker.id}`, {
            name: 'Zendaya',
            age: 17,
            talk: {
              watchedAt: '24/10/2020',
              rate: 4,
            },
          })
          .expect('status', 400)
          .then((responseUpdate) => {
            const { json } = responseUpdate;
            expect(json.message).toBe(
              'O campo "age" deve ser um número inteiro igual ou maior que 18',
            );
          });
      });
  });

  it('Será validado que não é possível editar uma pessoa palestrante sem o campo talk', async () => {
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
          .put(`${url}/talker/${resultTalker.id}`, {
            name: 'Zendaya',
            age: 25,
          })
          .expect('status', 400)
          .then((responseUpdate) => {
            const { json } = responseUpdate;
            expect(json.message).toBe(
              'O campo "talk" é obrigatório',
            );
          });
      });
  });

  it('Será validado que não é possível editar uma pessoa palestrante sem a chave watchedAt', async () => {
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
          .put(`${url}/talker/${resultTalker.id}`, {
            name: 'Zendaya',
            age: 25,
            talk: {
              rate: 4,
            },
          })
          .expect('status', 400)
          .then((responseUpdate) => {
            const { json } = responseUpdate;
            expect(json.message).toBe(
              'O campo "watchedAt" é obrigatório',
            );
          });
      });
  });

  it('Será validado que não é possível editar uma pessoa palestrante com watchedAt sem o formato "dd/mm/aaaa"', async () => {
    let resultTalker;
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
    for (let i = 0; i < dataTestArray.length; i++) {
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
            .put(`${url}/talker/${resultTalker.id}`, {
              name: 'Zendaya',
              age: 25,
              talk: {
                watchedAt: dataTestArray[i],
                rate: 4,
              },
            })
            .expect('status', 400)
            .then((responseUpdate) => {
              const { json } = responseUpdate;
              expect(json.message).toBe(
                'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"',
              );
            });
        });
    }
  });

  it('Será validado que não é possível editar uma pessoa palestrante sem a chave rate', async () => {
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
          .put(`${url}/talker/${resultTalker.id}`, {
            name: 'Zendaya',
            age: 25,
            talk: {
              watchedAt: '24/10/2020',
            },
          })
          .expect('status', 400)
          .then((responseUpdate) => {
            const { json } = responseUpdate;
            expect(json.message).toBe(
              'O campo "rate" é obrigatório',
            );
          });
      });
  });

  it('Será validado que não é possível editar uma pessoa palestrante com rate negativo', async () => {
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
          .put(`${url}/talker/${resultTalker.id}`, {
            name: 'Zendaya',
            age: 25,
            talk: {
              watchedAt: '24/10/2020',
              rate: -1,
            },
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

  it('Será validado que não é possível editar uma pessoa palestrante com rate igual a zero', async () => {
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
          .put(`${url}/talker/${resultTalker.id}`, {
            name: 'Zendaya',
            age: 25,
            talk: {
              watchedAt: '24/10/2020',
              rate: 0,
            },
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

  it('Será validado que não é possível editar uma pessoa palestrante com rate maior que 5', async () => {
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
          .put(`${url}/talker/${resultTalker.id}`, {
            name: 'Zendaya',
            age: 25,
            talk: {
              watchedAt: '24/10/2020',
              rate: 7,
            },
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
  
  it('Será validado que não é possível editar uma pessoa palestrante com rate com número decimal', async () => {
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
          .put(`${url}/talker/${resultTalker.id}`, {
            name: 'Zendaya',
            age: 25,
            talk: {
              watchedAt: '24/10/2020',
              rate: 2.5,
            },
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

  it('Será validado que o endpoint retorna um erro caso nenhuma pessoa palestrante seja encontrada', async () => {
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
          .put(`${url}/talker/999`, {
            name: 'Zendaya',
            age: 25,
            talk: {
              watchedAt: '24/10/2020',
              rate: 4,
            },
          })
          .expect('status', 404)
          .then((responseUpdate) => {
            const { json } = responseUpdate;
            expect(json.message).toBe('Pessoa palestrante não encontrada');
          });
      });
  });

  it('Será validado que são retornados os dados da pessoa palestrante editada com sucesso', async () => {
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
          .put(`${url}/talker/${resultTalker.id}`, {
            name: 'Zendaya',
            age: 25,
            talk: {
              watchedAt: '24/10/2020',
              rate: 4,
            },
          })
          .expect('status', 200)
          .then((responseUpdate) => {
            const { json } = responseUpdate;
            expect(json.id).toBe(resultTalker.id);
            expect(json.name).toBe('Zendaya');
            expect(json.age).toBe(25);
            expect(json.talk.watchedAt).toBe('24/10/2020');
            expect(json.talk.rate).toBe(4);
          });
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
          .put(`${url}/talker/${resultTalker.id}`, {
            name: 'Zendaya',
            age: 25,
            talk: {
              watchedAt: '24/10/2020',
              rate: 4,
            },
          })
          .expect('status', 200)
          .then((responseUpdate) => {
            expect(require(TALKER_FILE)).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  id: resultTalker.id,
                  name: 'Zendaya',
                  age: 25,
                  talk: {
                    watchedAt: '24/10/2020',
                    rate: 4,
                  },
                }),
              ]),
            );
          });
      });
  });
});
