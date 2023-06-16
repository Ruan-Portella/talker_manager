# Dúvidas frequentes

Abaixo estão algumas orientações e dúvidas comuns ao desenvolvimento do projeto.

Se houver qualquer outra dúvida ou problema, é só procurar a monitoria ou postar uma thread no slack. Estamos juntos! 👍

## Git e GitHub

<details>
  <summary>‼️ Antes de começar a desenvolver</summary><br />

1. Clone o repositório

   - Copie o endereço SSH do repositório e use-o para cloná-lo em sua máquina:
     - Por exemplo: `git clone git@github.com:tryber/sd-0x-project-x.git`.

     <details><summary>Local do endereço SSH na página inicial do repositório:</summary>

     ![endereço SSH do repositório](images/github-ssh-repo.png)

     </details>
   - Entre na pasta do repositório que você acabou de clonar:
     - `cd <diretório-do-projeto>`

2. Crie uma branch a partir da branch `main`

   - Verifique que você está na branch `main`
     - Exemplo: `git branch`
   - Se não estiver, mude para a branch `main`
     - Exemplo: `git checkout main`
   - Agora crie uma branch à qual você vai submeter os `commits` do seu projeto
     - Você deve criar uma branch no seguinte formato: `nome-de-usuario-nome-do-projeto`
     - Exemplo: `git checkout -b joaozinho-project-x`

3. Para cada etapa do desenvolvimento, adicione as mudanças ao _stage_ do Git e faça um `commit`

   - Verifique que as mudanças ainda não estão no _stage_
     - Exemplo: `git status` (devem aparecer listadas as alterações realizadas em vermelho)
   - Adicione o novo arquivo ao _stage_ do Git
     - Exemplo:
       - `git add .` (adicionando todas as mudanças - _que estavam em vermelho_ - ao stage do Git)
       - `git status` (devem aparecer listadas as alterações realizadas em verde)
   - Faça o `commit` inicial
     - Exemplo:
       - `git commit -m 'Iniciando o projeto X! #VQV 🚀'` (fazendo o primeiro commit)
       - `git status` (deve aparecer uma mensagem tipo _nothing to commit_ )

4. Adicione a sua branch com o novo `commit` ao repositório remoto

   - Usando o exemplo anterior: `git push -u origin joaozinho-sd-0x-project-x`

5. Crie um novo `Pull Request` _(PR)_

   - Vá até a página de _Pull Requests_ do repositório no GitHub.
      <details><summary>Local da página de Pull Requests no repositório:</summary>

     ![endereço SSH do repositório](images/github-pr-open.png)

     </details>
   - Clique no botão verde _"New pull request"_
   - Clique na caixa de seleção _"Compare"_ e escolha a sua branch **com atenção**
   - Clique no botão verde _"Create pull request"_
   - Adicione uma descrição para o _Pull Request_ e clique no botão verde _"Create pull request"_
   - **Não se preocupe em preencher mais nada por enquanto!**
   - Volte até a página de _Pull Requests_ do repositório e confira que o seu _Pull Request_ está criado

</details>

<details>
  <summary>⌨️ Durante o desenvolvimento</summary><br />

- Faça `commits` das alterações que você fizer no código regularmente

- Lembre-se de sempre após um (ou alguns) `commits` atualizar o repositório remoto

- Os comandos que você utilizará com mais frequência são:
    1. `git status` _(para verificar o que está em vermelho - fora do stage - e o que está em verde - no stage)_
    2. `git add` _(para adicionar arquivos ao stage do Git)_
    3. `git commit` _(para criar um commit com os arquivos que estão no stage do Git)_
    4. `git push -u nome-da-branch` _(para enviar o commit para o repositório remoto na primeira vez que fizer o `push` de uma nova branch)_
    5. `git push` _(para enviar o commit para o repositório remoto após o passo anterior)_

</details>

<details>
  <summary>🤝 Depois de terminar o desenvolvimento (opcional)</summary><br />

  Para **"entregar"** seu projeto, siga os passos a seguir:

- Vá até a página **DO SEU** _Pull Request_, adicione a label de _"code-review"_ e marque seus colegas
  - No menu à direita, clique no _link_ **"Labels"** e escolha a _label_ **code-review**
  - No menu à direita, clique no _link_ **"Assignees"** e escolha **o seu usuário**
  - No menu à direita, clique no _link_ **"Reviewers"** e digite `students`, selecione o time `tryber/students-sd-xx` onde `xx` é o número da sua turma

Se ainda houver alguma dúvida sobre como entregar seu projeto [aqui tem um video explicativo](https://vimeo.com/362189205).

</details>

<details>
  <summary>🕵🏿 Revisando um pull request</summary><br />

  Use o conteúdo sobre [Code Review](https://app.betrybe.com/learn/course/5e938f69-6e32-43b3-9685-c936530fd326/module/f04cdb21-382e-4588-8950-3b1a29afd2dd/section/b3af2f05-08e5-4b4a-9667-6f5f729c351d/lesson/36268865-fc46-40c7-92bf-cbded9af9006) para te ajudar a revisar os _Pull Requests_.

</details>

## Node e NPM

<details>
<summary>⚠️ <strong>Não</strong> rode o comando <code>npm audit fix</code>!</summary><br>

- Ele atualiza várias dependências do projeto, e essa atualização gera conflitos com o avaliador.

</details>

<details>
  <summary>🔽 Instalação de dependências com <code>npm install</code></summary><br />
  
- Instala as dependências Node da aplicação na pasta `node_modules`.
- Os outros scripts do projeto só funcionam corretamente após rodar este comando.

</details>

<details>
  <summary>🔁 Live reload com <code>npm run dev</code></summary><br />

  Usaremos o [Nodemon](https://nodemon.io) para monitorar as mudanças nos arquivos e reiniciar o servidor automaticamente.

  Este projeto já vem com as dependências relacionadas ao _nodemon_ configuradas no arquivo `package.json`.

  Para iniciar o servidor em modo de desenvolvimento basta executar o comando `npm run dev`. Este comando fará com que o servidor reinicie de forma automática ao salvar uma modificação realizada nos arquivos do projeto.
</details>

<details>
  <summary>🎛 Rodando o linter com <code>npm run lint</code></summary><br />

  Usaremos o [ESLint](https://eslint.org/) para fazer a análise estática do seu código.

  Este projeto já vem com as dependências relacionadas ao _linter_ configuradas nos arquivos `package.json`.

  Para poder rodar o `ESLint` em um projeto basta executar o comando `npm install` dentro do projeto e depois `npm run lint`. Se a análise do `ESLint` encontrar problemas no seu código, tais problemas serão mostrados no seu terminal. Se não houver problema no seu código, nada será impresso no seu terminal.

  Você pode também instalar o plugin do `ESLint` no `VSCode`. Para isso, basta fazer o download do [plugin `ESLint`](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) e instalá-lo.
</details>

<details>
  <summary>🛠 Rodando testes com <code>npm test</code></summary><br />

  Usaremos o [Jest](https://jestjs.io/pt-BR/) e o [Frisby](https://docs.frisbyjs.com/) para fazer os testes de API.

  Este projeto já vem configurado e com suas dependências.

- **Executando todos os testes**

  Para poder executar os testes, inicie sua aplicação com `npm run dev`, em seguida, basta executar o comando `npm test` e **todos** os seus testes serão executados.

- **Executando um teste específico**

  Para executar um teste específico, inicie sua aplicação com `npm run dev`, em seguida, basta executar o comando `npm test nome-do-teste`.

  > Colocamos o número do requisito como pré-fixo para facilitar, veja abaixo.

  Ex: Para executar o teste referente ao **01-getAllTalkers**, basta digitar `npm test 01`.

  ⚠️ **Importante:** os comandos de testes podem ser executados tanto no terminal do seu computador quanto do **_Docker_**.

</details>

## Erros comuns

<details>
<summary> ⛔ Erro de porta já utilizada: <code>EADDRINUSE</code> ou <code>port is already allocated</code></summary><br>

![erro na porta 3001](./images/erroDePorta.png)

- Se você se deparar com esse tipo de erro, quer dizer que sua aplicação já está utilizando a `porta 3001`, seja com outro processo do Node.js ou algum container Docker!

  - Você pode parar todos os processos Node com o comando `killall node`;

  - Você pode parar um container Docker com o comando `docker stop <nome-do-container>`.

- ✨ **Dica:** Antes de iniciar qualquer coisa, observe os containers que estão em execução em sua máquina usando o comando `docker container ls`;

</details>

## Rodando o projeto pelo Docker

<details>
<summary>⚠️  Rode comandos do NPM de <strong>dentro</strong> do container Node</summary><br>

- Caso opte por utilizar o Docker, **TODOS** os comandos disponíveis no `package.json` (npm start, npm test, npm run dev, ...) devem ser executados **DENTRO** do container, ou seja, no terminal que aparece após a execução do comando `docker exec` citado acima.

</details>

<details>
<summary>⚠️ Rode comandos do Git <strong>fora</strong> do container Node</summary><br>

- O **git** dentro do container não vem configurado com suas credenciais. Ou faça os commits fora do container, ou configure as suas credenciais do git dentro do container.

</details>

<details>
<summary>⚠️ Use a versão 1.29 do Docker Compose</summary>

- Para que você consiga rodar o seu projeto com docker e o avaliador funcione é fundamental que o seu docker compose esteja na **versão 1.29**.

  - Verifique sua versão:

  ```bash
  docker-compose --version
  ```

  Se não for a versão 1.29, faça os seguintes comandos para atualizar a versão:

  ```bash
  sudo rm /usr/local/bin/docker-compose
  sudo curl -L "<https://github.com/docker/compose/releases/download/1.29.0/docker-compose-$(uname> -s)-$(uname -m)" -o /usr/local/bin/docker-compose
  sudo chmod +x /usr/local/bin/docker-compose
  ```

</details>

<details>
<summary> 🐳 Iniciando serviços com <code>docker-compose up</code></summary><br>

- O arquivo [`docker-compose.yml`](./docker-compose.yml) tem dois serviços:
  - `backend`: serviço Node, usado para rodar aplicação e os testes
  - `db`: serviço do banco de dados MySQL

- O comando `docker-compose up -d`:
  - Inicia o serviço `backend`
    - Esse serviço irá inicializar um container chamado `talker_manager` (definido no arquivo [docker-compose.yml](docker-compose.yml)).
    - A flag `-d` faz o container rodar em segundo plano.
    - A partir daqui você pode acessar o container via CLI com `docker exec` ou abri-lo no VS Code.
  - Inicia o serviço `db`
    - Esse serviço irá inicializar um container chamado `talker_manager_db`
    - Ele é usado no [requisito 12](./README.md#12---crie-o-endpoint-get-talkerdb)

> ❓ Duvidas sobre a diferença entre container e service? Reveja a lição **Serviço vs. Container** na seção de **Docker** na plataforma. 👍

</details>

<details>
<summary> 🐳 Acessando um terminal de um container com <code>docker exec</code></summary><br>

- O comando `docker exec -it talker_manager bash`:
  - Dá acesso ao terminal interativo do container de nome `talker_manager`, que está rodando em segundo plano.

</details>

### Dicas

<details>
<summary>✨ Desenvolvendo o projeto no VS Code de dentro do container</summary><br>

- A extensão `Dev Containers` (que estará na seção de extensões recomendadas do VS Code) é indicada para que você possa desenvolver sua aplicação no container Docker direto no VS Code, como você faz com seus arquivos locais.

  ![Extensão Dev Containers do VS Code](./images/dev-container.png)

</details>

<details>
  <summary id="debugging">🐞🗡️ Depuração (Debugging)</summary>

  Em primeiro lugar sua aplicação precisa estar rodando o script `dev` via `docker compose`.

  Existe nesse projeto uma configuração de depuração para o VScode, localizada na pasta `.vscode`.

  Para utilizá-la você pode clicar no ícone de _Run and Debug_ ou usar a tecla de atalho `Ctrl + Shift + D`:

  ![debugger icon](./images/debugger_icon.png)

  Vai parecer uma interface assim no canto superior do seu VScode:

  ![debugger_top_interface](./images/debugger_top_interface.png)

  O simbolo 🔽 é uma caixa de seleção, como um `<select>` HTML, este abriga os modos de depuração que o VScode encontrou, nesse projeto temos apenas uma opção a `Depurar com Docker`

  Para iniciar a depuração basta clicar no _play_ verde ▶️.

  Se tudo der certo o debugger agora está conectado no processo que está rodando sua aplicação, você sabe que ele está funcionando se aparecer essa barrinha no topo da sua tela:

  ![debugger control bar](./images/debugger_control_bar.png)

  Agora você consegue ativar os _breakpoints_ ⏺️ ao lado do número da linha

  ![debugger breakpoint](./images/debugger_breakpoint.png)

  Quando clicar nele, este fica vermelho e quando a API executar essa linha, ela vai parar.

  Com tudo preparado, vamos fazer um teste, vou fazer uma requisição para acionar a execução da linha 7 do `src/app.js`:

  ![debugger in action](./images/debugger_in_action.png)

  Note que todas a variáveis do escopo local (`_request`, `response`, `this`) de onde o cursor está podem ser inspecionadas.
  ![debugger variables](./images/debugger_variables.png)

  <details>
    <summary>Gif com o passo a passo</summary>

  ![debugger animation](./images/debugger_animation.gif)

  </details><br>

  Agora é com você! ✨

  Mas vou deixar aqui uma colinha de como funciona cada ícone da barra de depuração:

- ▶️ Continue: Vai executar o código até chegar no próximo _breakpoint_, dar um erro ou não haver mais o que executar;
- ⤵️ Step Over: Executa linha atual e pula para a próxima;
- ⬇️ Step Into: Entra dentro da função que vai ser executada na linha do cursor;
- ⬆️ Step Out: Saí da função que vai ser executada na linha do cursor, executando o resto dela;
- 🔄 Restart: Reinicia o processo de depuração, matando o processo atual e criando um novo.
- ⏹️ Stop: Para o processo de depuração, mata o processo.

> 💡 Anota a dica: talvez você tenha se perguntado: uai, mas não tem como voltar? Realmente não tem, é um processo que só vai na direção que o código executa. Logo, para "voltar uma linha" é preciso que ativemos o gatilho que faz o depurador passar por aquela linha que a gente quer voltar, fazendo uma nova requisição por exemplo.

</details>

## Rodando os testes do projeto

<details>
<summary>🧪 O avaliador pode testar os requisitos fora da ordem que aparecem no README</summary><br>

- O avaliador automático não necessariamente avalia seu projeto na ordem em que os requisitos aparecem no readme. Isso acontece para deixar o processo de avaliação mais rápido. Então, não se assuste se isso acontecer, ok?

</details>

## Depois de completar o projeto

<details>
<summary>🗂 Compartilhe seu portfólio!</summary><br />

Após finalizar os requisitos, chegou a hora de mostrar ao mundo que você aprendeu algo novo! 🚀

Siga esse [**guia que preparamos com carinho**](https://app.betrybe.com/learn/course/5e938f69-6e32-43b3-9685-c936530fd326/module/a3cac6d2-5060-445d-81f4-ea33451d8ea4/section/d4f5e97a-ca66-4e28-945d-9dd5c4282085/day/eff12025-1627-42c6-953d-238e9222c8ff/lesson/49cb103b-9e08-4ad5-af17-d423a624285a) para disponibilizar o projeto finalizado no seu GitHub pessoal.

Esse passo é super importante para ganhar mais visibilidade no mercado de trabalho, mas também é útil para manter um back-up do seu trabalho.

E você sabia que o LinkedIn é a principal rede social profissional e compartilhar o seu aprendizado lá é muito importante para quem deseja construir uma carreira de sucesso? Compartilhe esse projeto no seu LinkedIn, marque o perfil da Trybe (@trybe) e mostre para a sua rede toda a sua evolução.

</details>
