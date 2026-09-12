# TechStore - CRUD de Produtos

Projeto da atividade **Desenvolvimento e Integração de uma API Local para o Fluxo do CRUD de E-commerce**. A aplicação integra uma interface Angular a uma API local Express para cadastrar, listar, buscar, atualizar e excluir produtos de eletrônicos e jogos.

Base original: [HevelinFR/angular-crud-api](https://github.com/HevelinFR/angular-crud-api).

## Tecnologias

- Angular 22
- Bootstrap 5
- Node.js 24 LTS
- Express 5
- Postman/Newman
- Persistência local em `backend/data/produtos.json`

## Instalação

Na raiz do projeto, execute:

```bash
npm ci
npm ci --prefix backend
npm ci --prefix frontend
```

## Executar localmente

Terminal 1, na raiz:

```bash
npm run dev --prefix backend
```

API: `http://localhost:3000/api/products`

Terminal 2, na raiz:

```bash
npm start --prefix frontend
```

Interface: `http://localhost:4200`

## Funcionalidades

| Operação | Método e rota |
|---|---|
| Listar produtos | `GET /api/products` |
| Buscar produto por ID | `GET /api/products/:id` |
| Cadastrar produto | `POST /api/products` |
| Atualizar produto | `PUT /api/products/:id` |
| Excluir produto | `DELETE /api/products/:id` |

O corpo de `POST` e `PUT` usa os campos `nome`, `descricao`, `categoria`, `preco` e `imagem`. O campo `id` é gerado pela API.

## Testes

Com a API parada, execute na raiz:

```bash
npm run test:api
npm run test:frontend
npm run build
```

Resultado validado nesta entrega:

- API/Postman: 13 requisições, 27 verificações, 0 falhas.
- Frontend: 3 arquivos de teste, 13 testes, 0 falhas.
- Build Angular: concluído com aviso de tamanho inicial, sem erro.

## Postman

Importe no Postman Desktop:

- `postman/TechStore-CRUD.postman_collection.json`
- `postman/Local.postman_environment.json`

Selecione o ambiente **TechStore Local** e execute a coleção completa.

## Documentação da entrega

- Tutorial final: `docs/TUTORIAL-FINAL-GITHUB-AVA.md`
- Tutorial final em PDF: `docs/Tutorial-Final-GitHub-AVA.pdf`
- Evidências: `docs/evidencias/VALIDACAO.md`
- Resultado Newman: `docs/evidencias/resultado-postman.json`

## Observação

Este é um projeto didático local. Não há autenticação, carrinho, pagamento ou banco de dados externo. Para entregar no AVA, publique o código em um repositório GitHub público e envie a URL pública do repositório.
