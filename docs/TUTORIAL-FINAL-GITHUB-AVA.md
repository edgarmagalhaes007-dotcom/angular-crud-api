# Tutorial final - publicar o CRUD de E-commerce no GitHub e entregar no AVA

Este tutorial conclui a parte que ainda ficou pendente: conferir visualmente a aplicação no seu computador, criar o fork público, publicar o código no GitHub e enviar a URL ao AVA.

O objetivo da atividade e publicar **o código-fonte completo** em um repositório GitHub público. A aplicação continua sendo uma API local com frontend local. Não e necessario publicar a API em servidor externo, configurar GitHub Pages, contratar hospedagem ou transformar o projeto em site online.

## 1. O que precisa estar pronto no final

Ao terminar, voce deve ter:

| Item | Resultado esperado |
|---|---|
| Fork publico | Um repositorio seu no GitHub, publico, baseado em `HevelinFR/angular-crud-api` |
| Codigo atualizado | Pastas `frontend`, `backend`, `postman`, `docs`, `scripts` e arquivos de configuracao no seu repositorio |
| Teste local | Frontend em `http://localhost:4200` e API em `http://localhost:3000/api/products` funcionando no seu computador |
| Evidencia de API | Colecao Postman importada ou resultado Newman em `docs/evidencias/resultado-postman.json` |
| Envio AVA | URL publica do seu repositorio enviada na atividade correta |

Nesta sessao, a validacao automatizada passou:

| Validacao | Resultado |
|---|---|
| API + Postman/Newman | 13 requisicoes, 27 verificacoes, 0 falhas |
| Frontend Angular | 3 arquivos de teste, 13 testes, 0 falhas |
| Build Angular | Concluido; houve apenas aviso de tamanho inicial |

A publicacao no GitHub nao foi executada automaticamente porque a ferramenta disponivel nesta sessao nao cria fork. Essa parte precisa ser feita no navegador da sua conta GitHub.

## 2. Instalar e conferir as ferramentas

Use preferencialmente o **Prompt de Comando** do Windows ou o terminal **Command Prompt** dentro do VS Code. O PowerShell tambem funciona, mas pode bloquear scripts `npm.ps1` em alguns computadores.

Instale ou confira:

| Ferramenta | Para que serve | Link oficial |
|---|---|---|
| Node.js 24 LTS | Executar backend, Angular e npm | [Node.js Downloads](https://nodejs.org/en/download/) |
| Git for Windows | Clonar, versionar e enviar ao GitHub | [Git for Windows](https://git-scm.com/install/windows) |
| Visual Studio Code | Editar e abrir terminais do projeto | [VS Code](https://code.visualstudio.com/download) |
| Postman Desktop | Testar os endpoints da API local | [Postman Downloads](https://www.postman.com/downloads/) |

Depois de instalar, feche e reabra o terminal. Confira:

```bat
node -v
npm -v
git --version
```

O projeto foi validado com Node `24.19.0` e npm `11.9.0`. O `package.json` aceita Node `^22.22.3 || ^24.15.0 || >=26.0.0`. Para simplificar, use **Node 24 LTS**, versao `24.15.0` ou superior dentro da linha 24.

O Angular CLI global nao e obrigatorio para este projeto. Apos instalar o frontend, voce pode conferir o CLI local assim:

```bat
npm exec --prefix frontend -- ng version
```

Se o professor pedir explicitamente o comando `ng -v`, instale o CLI global:

```bat
npm install -g @angular/cli
ng version
```

## 3. Criar o fork publico no GitHub

1. Entre na sua conta em [github.com](https://github.com).
2. Abra o repositorio base: [https://github.com/HevelinFR/angular-crud-api](https://github.com/HevelinFR/angular-crud-api).
3. Clique em **Fork**.
4. Em **Owner**, selecione o seu perfil.
5. Mantenha o nome `angular-crud-api`, se estiver disponivel.
6. Clique em **Create fork**.

A documentacao oficial do GitHub descreve esse fluxo em [Fork a repository](https://docs.github.com/en/pull-requests/how-tos/work-with-forks/fork-a-repo).

Depois da criacao, o endereco do seu fork ficara parecido com:

```text
https://github.com/SEU-USUARIO/angular-crud-api
```

Se voce usar a conta identificada nesta sessao, o endereco esperado apos criar o fork deve ficar parecido com:

```text
https://github.com/edgarmagalhaes007-dotcom/angular-crud-api
```

Nao envie ao AVA a URL da professora. Envie a URL do repositorio que esta no seu perfil.

## 4. Clonar o seu fork no computador

Crie uma pasta para projetos. Exemplo:

```bat
cd %USERPROFILE%
mkdir Projetos
cd Projetos
```

No GitHub, abra o seu fork, clique em **Code** e copie a URL HTTPS. Depois clone:

```bat
git clone https://github.com/SEU-USUARIO/angular-crud-api.git
cd angular-crud-api
```

Confira se o clone aponta para o seu fork:

```bat
git remote -v
```

O resultado deve mostrar `origin` apontando para `https://github.com/SEU-USUARIO/angular-crud-api.git`.

Se aparecer `HevelinFR/angular-crud-api`, voce clonou o repositorio original, nao o seu fork. Nesse caso, entre na pasta correta do seu fork ou ajuste o remoto:

```bat
git remote set-url origin https://github.com/SEU-USUARIO/angular-crud-api.git
```

Use esse comando somente se tiver certeza de que a pasta atual e o projeto certo.

## 5. Copiar o pacote final para dentro do fork

Extraia o arquivo final da entrega em uma pasta separada, por exemplo em `Downloads`.

Dentro do ZIP existe uma pasta do projeto chamada `angular-crud-api`. Copie **o conteudo dessa pasta** para dentro da pasta clonada do seu fork.

O resultado correto deve ser assim:

```text
angular-crud-api/
  backend/
  frontend/
  postman/
  docs/
  scripts/
  package.json
  README.md
```

Evite este erro:

```text
angular-crud-api/
  angular-crud-api/
    backend/
    frontend/
```

Se isso acontecer, mova o conteudo da pasta interna para a raiz do clone.

Preserve a pasta Git criada pelo clone. Ela e invisivel no Windows por padrao e se chama `.git`. Nao execute `git init` dentro do projeto ja clonado.

Depois de copiar, confira:

```bat
git status
```

E esperado aparecerem arquivos modificados ou novos. Nao devem aparecer `node_modules`, `.angular`, `dist` ou arquivos de senha.

## 6. Instalar dependencias

Abra o projeto no VS Code:

```bat
code .
```

No terminal do VS Code, estando na raiz do projeto, execute:

```bat
npm ci
npm ci --prefix backend
npm ci --prefix frontend
```

Esses tres comandos usam os arquivos `package-lock.json` e deixam o ambiente mais previsivel.

Se aparecer erro dizendo que `package.json` nao foi encontrado, voce esta na pasta errada. Volte para a raiz do projeto, onde ficam `backend`, `frontend`, `postman`, `docs` e o `package.json` principal.

## 7. Rodar a validacao automatizada

Antes de iniciar os servidores manualmente, rode os testes. A API deve estar parada para o teste automatizado usar a porta `3000`.

Na raiz do projeto:

```bat
npm run test:api
```

Resultado esperado:

- Mensagem de persistencia aprovada.
- Newman executando a colecao.
- 13 requests executadas.
- 27 assertions.
- 0 failures.

O arquivo de resultado fica em:

```text
docs/evidencias/resultado-postman.json
```

Depois rode:

```bat
npm run test:frontend
npm run build
```

Resultado esperado:

- 3 arquivos de teste aprovados.
- 13 testes aprovados.
- Build concluido.
- Pode aparecer aviso de tamanho inicial do bundle, mas nao erro.

Se o build terminar com `Application bundle generation complete`, ele esta ok para esta entrega.

## 8. Iniciar a API e o frontend

Agora abra dois terminais no VS Code.

Terminal 1, na raiz do projeto:

```bat
npm run dev --prefix backend
```

Deixe esse terminal aberto. A API deve ficar em:

```text
http://localhost:3000/api/products
```

Terminal 2, tambem na raiz do projeto:

```bat
npm start --prefix frontend
```

A interface deve abrir ou ficar disponivel em:

```text
http://localhost:4200
```

Abra `http://localhost:4200` no navegador. Nao abra a interface na porta `3000`; a porta `3000` e da API.

## 9. Conferir visualmente no navegador

Use este roteiro para garantir que a aplicacao esta funcionando de ponta a ponta.

1. Abra `http://localhost:4200`.
2. A lista de produtos deve carregar com os produtos vindos da API.
3. Clique em **Novo Produto**.
4. Cadastre um produto de teste:

```text
Nome: Controle Gamer - Validacao
Descricao: Controle sem fio para computador e console.
Categoria: Jogos
Preco: 249.90
Imagem: deixe em branco ou use uma URL http/https valida
```

5. Clique em salvar. A aplicacao deve mostrar mensagem de sucesso e voltar para a lista.
6. Atualize a pagina com `F5`. O produto cadastrado deve continuar aparecendo.
7. Clique em **Editar** no produto criado.
8. Altere o preco para `199.90` e salve.
9. Confira se a lista voltou com o novo valor.
10. Clique em **Excluir** e cancele a confirmacao. O produto deve permanecer.
11. Clique novamente em **Excluir** e confirme. O produto deve desaparecer.

Teste tambem o comportamento de erro:

1. Com a lista aberta, pare apenas o backend pressionando `Ctrl+C` no Terminal 1.
2. Recarregue a pagina.
3. A interface deve mostrar uma mensagem de erro de conexao e o botao **Tentar novamente**.
4. Reinicie o backend.
5. Clique em **Tentar novamente**.

Teste o formulario:

1. Entre em **Novo Produto**.
2. Preencha alguns dados.
3. Pare a API.
4. Tente salvar.
5. A aplicacao deve manter os dados no formulario e mostrar mensagem de erro.

Teste um produto inexistente:

```text
http://localhost:4200/produtos/editar/999999999
```

A aplicacao deve informar que o produto nao foi encontrado ou impedir a edicao invalida.

## 10. Conferir no Postman

Com a API ligada, abra o Postman Desktop.

1. Clique em **Import**.
2. Importe `postman/TechStore-CRUD.postman_collection.json`.
3. Importe `postman/Local.postman_environment.json`.
4. Selecione o ambiente **TechStore Local**.
5. Confira a variavel `baseUrl`:

```text
http://localhost:3000
```

6. Abra a colecao **TechStore - CRUD de Produtos**.
7. Clique em **Run collection**.
8. Execute uma iteracao, mantendo a ordem original.

Resultado esperado:

| Campo | Esperado |
|---|---|
| Requests | 13 |
| Assertions | 27 |
| Failures | 0 |

A colecao cria, consulta, atualiza e exclui um produto de teste. O ID e capturado automaticamente pelo Postman. Nao use ID fixo nem altere a lista manualmente durante a execucao da colecao.

Se estiver usando Postman Web, talvez seja necessario instalar ou ativar o Desktop Agent para acessar `localhost`. O Postman Desktop costuma ser o caminho mais simples.

## 11. Tirar evidencias opcionais

A atividade pede principalmente a URL do repositorio. Mesmo assim, e recomendavel incluir evidencias.

Sugestao de prints:

| Print | O que mostrar |
|---|---|
| Lista de produtos | Interface em `localhost:4200` com produtos carregados |
| Cadastro | Produto novo salvo e aparecendo na lista |
| Edicao | Produto com preco alterado |
| Exclusao | Lista sem o produto removido |
| Postman | Runner com 13 requests e 0 failures |
| GitHub | Repositorio publico com README aparecendo |

Voce pode salvar os prints em:

```text
docs/evidencias/prints/
```

No Windows, use `Win + Shift + S`, cole no Paint ou em outro editor e salve como PNG. Evite mostrar senhas, tokens, e-mails privados ou dados pessoais desnecessarios.

## 12. Publicar no GitHub

Depois de testar, pare os servidores com `Ctrl+C` nos dois terminais.

Confira o status:

```bat
git status
```

Confira se nao existem pastas pesadas ou temporarias:

```bat
git status --short
```

Nao devem entrar no commit:

```text
node_modules/
.angular/
dist/
coverage/
*.log
.env
```

Esses itens ja estao cobertos pelo `.gitignore`.

Configure sua identidade Git se ainda nao tiver feito:

```bat
git config --global user.name "SEU NOME"
git config --global user.email "SEU EMAIL DO GITHUB"
```

Se preferir, use o e-mail noreply exibido pelo proprio GitHub em **Settings > Emails**. Nao copie um e-mail de exemplo sem trocar pelos seus dados.

Adicione e envie:

```bat
git add .
git diff --cached --stat
git commit -m "Conclui integracao CRUD de produtos"
git push origin main
```

Durante o `git push`, o GitHub pode abrir uma tela de login no navegador por meio do Git Credential Manager. Use o login normal do GitHub. Nao digite sua senha do GitHub como senha HTTPS no terminal; o GitHub usa autenticacao por navegador ou token.

Se o seu fork estiver na branch `master`, substitua `main` por `master`:

```bat
git branch --show-current
git push origin master
```

Nao use `git push --force` para esta entrega.

## 13. Conferir o repositorio publico

Depois do push:

1. Abra o repositorio no GitHub.
2. Confira se o README novo aparece na pagina inicial.
3. Verifique se existem as pastas `backend`, `frontend`, `postman`, `docs` e `scripts`.
4. Confira se `docs/evidencias/resultado-postman.json` esta no repositorio.
5. Confira se o repositorio aparece como **Public**.
6. Abra a URL em uma janela anonima ou outro navegador sem login.

Se a janela anonima abrir o repositorio, o tutor tambem deve conseguir acessar.

Observacao importante: forks de repositorios publicos normalmente ficam publicos dentro da rede do GitHub. Se voce criou um repositorio novo em vez de fork, a visibilidade fica em **Settings > General > Danger Zone > Change repository visibility**.

## 14. Enviar a URL ao AVA

No AVA:

1. Abra a disciplina correta.
2. Entre na atividade de entrega do CRUD/API local.
3. Cole a URL publica do seu repositorio.
4. Anexe prints ou a colecao Postman somente se o AVA tiver campo para isso ou se o professor pedir.
5. Salve.
6. Confirme se aparece status de envio concluido, enviado ou submetido.

A URL correta deve ser semelhante a:

```text
https://github.com/SEU-USUARIO/angular-crud-api
```

Nao envie:

```text
http://localhost:4200
http://localhost:3000/api/products
https://github.com/HevelinFR/angular-crud-api
```

`localhost` so funciona no seu computador. A URL do AVA precisa ser a URL publica do codigo no GitHub.

## 15. Checklist final antes de enviar

Marque antes do envio:

| Conferencia | OK |
|---|---|
| Node, npm e Git instalados |  |
| Fork criado na sua conta |  |
| Codigo final copiado para o fork |  |
| `npm ci` executado na raiz, backend e frontend |  |
| `npm run test:api` passou |  |
| `npm run test:frontend` passou |  |
| `npm run build` concluiu |  |
| Interface abriu em `localhost:4200` |  |
| API respondeu em `localhost:3000/api/products` |  |
| Cadastro funcionou visualmente |  |
| Edicao funcionou visualmente |  |
| Exclusao funcionou visualmente |  |
| Colecao Postman executou sem falhas |  |
| Commit criado |  |
| Push enviado ao GitHub |  |
| Repositorio esta publico |  |
| URL publica enviada no AVA |  |

## 16. Problemas comuns

| Problema | Como resolver |
|---|---|
| `node` nao reconhecido | Reinstale Node 24 LTS, marque a opcao de adicionar ao PATH e reabra o terminal |
| `npm.ps1 cannot be loaded` | Use Prompt de Comando no VS Code ou execute `npm.cmd` |
| `ng` nao reconhecido | Use `npm start --prefix frontend` ou `npm exec --prefix frontend -- ng version` |
| `ENOENT package.json` | Voce esta na pasta errada; volte para a raiz do projeto |
| Porta 3000 ocupada | Pare a API aberta anteriormente com `Ctrl+C` |
| `Cannot GET /` na porta 3000 | A API fica em `/api/products`, nao na raiz `/` |
| Angular nao lista produtos | Confirme se backend e frontend estao ligados ao mesmo tempo |
| Postman falha em `localhost` | Use Postman Desktop ou Desktop Agent |
| `400 Bad Request` | Revise campos obrigatorios e preco maior que zero |
| `404 Not Found` | Verifique o ID usado e a rota |
| `git push` negado | Confira se `origin` aponta para o seu fork e faca login no GitHub |
| Repositorio privado | Altere a visibilidade para publico ou recrie como fork publico |
| Pasta duplicada `angular-crud-api/angular-crud-api` | Mova o conteudo da pasta interna para a raiz do clone |

## 17. O que este projeto demonstra

O projeto atende ao objetivo da atividade porque:

| Capacidade | Como aparece no projeto |
|---|---|
| Reconhecer servicos do servidor | Rotas Express em `backend/src/server.js` |
| Reconhecer especificacoes | README, Postman e contrato da API documentam rotas, corpos e respostas |
| Usar servicos do servidor | `ProdutoService` chama GET, POST, PUT e DELETE |
| Tratar falhas do servidor | Componentes exibem erros de conexao, `400`, `404` e falhas inesperadas |
| Integrar framework e linguagem | Angular usa HttpClient, rotas, componentes, formularios reativos e Bootstrap |
| Refletir interacoes do usuario | Cadastro, edicao, listagem e exclusao alteram dados pela API local |

Arquivos principais:

| Arquivo | Papel |
|---|---|
| `frontend/src/app/produtos/produto.service.ts` | Chamadas HTTP do CRUD |
| `frontend/src/app/produtos/produto-formulario/` | Cadastro e atualizacao |
| `frontend/src/app/produtos/lista-produtos/` | Consulta e exclusao |
| `frontend/src/app/produtos/erro-api.ts` | Mensagens de erro exibidas ao usuario |
| `backend/src/server.js` | API local Express |
| `backend/data/produtos.json` | Dados persistidos localmente |
| `postman/TechStore-CRUD.postman_collection.json` | Roteiro de teste dos endpoints |

## 18. Referencias usadas

- Repositorio base: [HevelinFR/angular-crud-api](https://github.com/HevelinFR/angular-crud-api)
- Criacao de fork: [GitHub Docs - Fork a repository](https://docs.github.com/en/pull-requests/how-tos/work-with-forks/fork-a-repo)
- Adicionar arquivos no GitHub: [GitHub Docs - Adding a file to a repository](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository)
- Autenticacao no GitHub: [GitHub Docs - About authentication to GitHub](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/about-authentication-to-github)
- Compatibilidade Angular: [Angular - Version compatibility](https://angular.dev/reference/versions)
- Node.js: [Node.js Downloads](https://nodejs.org/en/download/)
- Git for Windows: [Git Downloads for Windows](https://git-scm.com/install/windows)
- VS Code: [Visual Studio Code Download](https://code.visualstudio.com/download)
- Postman: [Postman Downloads](https://www.postman.com/downloads/)

