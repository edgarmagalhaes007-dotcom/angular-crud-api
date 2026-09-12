# Resposta técnica - conclusão da atividade

## Desenvolvimento e integração da API local

A solução utiliza uma aplicação Angular para gerenciar o catálogo de uma loja de eletrônicos e jogos. O Angular organiza a interface em componentes, representa os dados com interfaces TypeScript e centraliza as requisições no `ProdutoService`. No servidor, Node.js executa a API Express, responsável pelas rotas HTTP e pela persistência dos registros em um arquivo JSON local.

O modelo `Produto` contém `id`, `nome`, `descricao`, `categoria`, `preco` e `imagem`. O tipo `ProdutoEntrada` corresponde aos campos que o formulário pode enviar; o ID é gerado pelo servidor. Essa separação evita exigir um identificador fictício durante o cadastro.

## Implementação do serviço

O serviço final utiliza os endpoints e os tipos de retorno da API-base:

```typescript
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Produto, ProdutoEntrada } from './produto.model';

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private readonly apiUrl = 'http://localhost:3000/api/products';

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.apiUrl}/${id}`);
  }

  cadastrar(produto: ProdutoEntrada): Observable<Produto> {
    return this.http.post<Produto>(this.apiUrl, produto);
  }

  atualizar(id: number, produto: ProdutoEntrada): Observable<Produto> {
    return this.http.put<Produto>(`${this.apiUrl}/${id}`, produto);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

O `HttpClient` está registrado por `provideHttpClient()` em `app.config.ts`. A abordagem corresponde à arquitetura standalone da base. O Bootstrap está integrado aos estilos globais, garantindo os estilos dos formulários, cartões e alertas.

## Comportamento da interface

Ao abrir a listagem, o componente solicita os produtos à API. Para cadastrar, o formulário valida os campos obrigatórios e o preço positivo; em seguida, envia POST. Na edição, o ID é validado, o produto é consultado por GET e os campos são preenchidos. Ao salvar alterações, o serviço envia PUT completo ao recurso selecionado.

Os componentes se inscrevem nos Observables para receber o resultado das operações. A aplicação apresenta estado de carregamento durante as chamadas e bloqueia envios duplicados. A navegação para a lista ocorre somente depois da resposta de sucesso e leva a mensagem de confirmação. Em caso de erro, os valores preenchidos permanecem disponíveis para correção ou nova tentativa.

Na exclusão, a aplicação pede confirmação, envia DELETE e recebe `204 No Content`. Depois remove o item da tela e consulta novamente a lista. As mensagens distinguem erro de conexão, dados inválidos e produto inexistente. Falha ao carregar o catálogo não é apresentada como ausência de produtos.

## Validação obtida

A coleção criada para o projeto contém 13 requisições ordenadas e 27 verificações. Ela abrange listagem, cadastro, consulta individual, atualização, exclusão, cadastro inválido, atualização inválida e operações sobre produto já excluído. A execução pelo Newman terminou sem falhas.

Também foi verificada a gravação física no JSON e a recuperação do produto após reiniciar a API em uma pasta temporária. O teste usa o código original do backend e dados isolados, sem modificar os produtos demonstrativos do repositório.

No Angular, 13 testes passaram, cobrindo o contrato HTTP, retorno 204, propagação de falhas, erro de conexão, bloqueio de POST duplicado, ausência de navegação antes da resposta, preservação dos dados após 400 e rejeição de nome composto só por espaços. A compilação concluiu com um aviso de tamanho do pacote inicial, documentado no README.

Essas evidências confirmam os cenários executados. Não constituem teste de carga, auditoria de segurança nem garantia de comportamento em produção. A navegação visual em navegador real não foi concluída nesta sessão porque o acesso remoto a localhost foi bloqueado; o roteiro de conferência local acompanha a entrega.

## Resultado e etapa administrativa

A implementação entregue atende às operações CRUD requeridas e oferece documentação, coleção Postman e evidências reproduzíveis. A estrutura relaciona as ações do usuário aos serviços do servidor e permite compreender os dados enviados, os códigos de retorno e o tratamento assíncrono.

Para concluir a entrega acadêmica, é necessário criar o fork no perfil do estudante, enviar este código ao repositório público e inserir no AVA a URL real desse repositório. A publicação e o envio ao AVA não foram realizados nesta sessão. O procedimento está detalhado no README; não se deve substituir a URL da entrega pelo endereço do repositório-base ou pelo localhost.
