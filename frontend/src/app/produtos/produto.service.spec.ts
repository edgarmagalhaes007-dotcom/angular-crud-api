import { TestBed } from '@angular/core/testing';
import { provideHttpClient, HttpErrorResponse } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ProdutoService } from './produto.service';
import { Produto, ProdutoEntrada } from './produto.model';
import { mensagemErroApi } from './erro-api';

const entrada: ProdutoEntrada = { nome: 'Controle', descricao: 'Controle sem fio', categoria: 'Jogos', preco: 249.9, imagem: '' };
const produto: Produto = { id: 7, ...entrada };
const base = 'http://localhost:3000/api/products';

describe('Contrato HTTP de produtos', () => {
  let service: ProdutoService;
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(ProdutoService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());
  it('consulta uma coleção e preserva a lista vazia', () => {
    let resultado: Produto[] | undefined;
    service.listar().subscribe(valor => resultado = valor);
    http.expectOne({ method: 'GET', url: base }).flush([]);
    expect(resultado).toEqual([]);
  });
  it('consulta um objeto por ID, sem esperar um vetor', () => {
    let resultado: Produto | undefined;
    service.buscarPorId(7).subscribe(valor => resultado = valor);
    http.expectOne({ method: 'GET', url: `${base}/7` }).flush(produto);
    expect(resultado?.nome).toBe('Controle');
  });
  it('cadastra com JSON sem ID e recebe o ID da API (201)', () => {
    let resultado: Produto | undefined;
    service.cadastrar(entrada).subscribe(valor => resultado = valor);
    const req = http.expectOne({ method: 'POST', url: base });
    expect(req.request.body).toEqual(entrada);
    expect(req.request.body.id).toBeUndefined();
    req.flush(produto, { status: 201, statusText: 'Created' });
    expect(resultado?.id).toBe(7);
  });
  it('atualiza enviando todos os campos ao ID solicitado', () => {
    let resultado: Produto | undefined;
    service.atualizar(7, { ...entrada, preco: 199.9 }).subscribe(valor => resultado = valor);
    const req = http.expectOne({ method: 'PUT', url: `${base}/7` });
    expect(req.request.body).toEqual({ ...entrada, preco: 199.9 });
    req.flush({ ...produto, preco: 199.9 });
    expect(resultado?.preco).toBe(199.9);
  });
  it('aceita DELETE 204 sem tentar ler JSON de produto', () => {
    let recebeu = false;
    service.excluir(7).subscribe(() => recebeu = true);
    http.expectOne({ method: 'DELETE', url: `${base}/7` }).flush(null, { status: 204, statusText: 'No Content' });
    expect(recebeu).toBe(true);
  });
  for (const status of [400, 404, 500]) {
    it(`propaga ${status} pelo canal error, sem emitir falso sucesso`, () => {
      const sucesso = vi.fn(); const erro = vi.fn();
      service.buscarPorId(7).subscribe({ next: sucesso, error: erro });
      http.expectOne(`${base}/7`).flush({ erro: 'Falha de teste' }, { status, statusText: 'Error' });
      expect(sucesso).not.toHaveBeenCalled();
      expect(erro.mock.calls[0][0].status).toBe(status);
    });
  }
  it('distingue falha de conexão de um erro HTTP do servidor', () => {
    let mensagem = '';
    service.listar().subscribe({ error: erro => mensagem = mensagemErroApi(erro, 'listar') });
    http.expectOne(base).error(new ProgressEvent('error'));
    expect(mensagem).toContain('conectar ao servidor');
    expect(mensagemErroApi(new HttpErrorResponse({ status: 404 }), 'buscar')).toContain('Produto não encontrado');
    expect(mensagemErroApi(new HttpErrorResponse({ status: 500 }), 'salvar')).toContain('servidor encontrou');
  });
});
