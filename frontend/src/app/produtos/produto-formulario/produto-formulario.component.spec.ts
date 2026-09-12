import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { ProdutoFormularioComponent } from './produto-formulario.component';

const base = 'http://localhost:3000/api/products';
describe('Fluxo de cadastro', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ProdutoFormularioComponent],
    providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
  }));
  afterEach(() => TestBed.inject(HttpTestingController).verify());
  function preparar() {
    const fixture = TestBed.createComponent(ProdutoFormularioComponent);
    fixture.detectChanges();
    for (const [seletor, valor] of [['#nome', 'Controle'], ['#descricao', 'Controle sem fio'], ['#categoria', 'Jogos'], ['#preco', '249.90']]) {
      const campo = fixture.nativeElement.querySelector(seletor);
      campo.value = valor; campo.dispatchEvent(new Event('input'));
    }
    fixture.detectChanges();
    return fixture;
  }
  it('aguarda a API e impede POST duplicado e navegação antecipada', () => {
    const fixture = preparar();
    const router = TestBed.inject(Router);
    const navegar = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const form: HTMLFormElement = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    const http = TestBed.inject(HttpTestingController);
    const req = http.expectOne({ method: 'POST', url: base });
    expect(navegar).not.toHaveBeenCalled();
    req.flush({ id: 7, ...req.request.body }, { status: 201, statusText: 'Created' });
    expect(navegar).toHaveBeenCalledWith(['/produtos'], { state: { sucesso: 'Produto cadastrado com sucesso!' } });
  });
  it('mantém dados e formulário após 400, sem navegar', () => {
    const fixture = preparar();
    const navegar = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    TestBed.inject(HttpTestingController).expectOne(base).flush({ erro: 'Preço inválido.' }, { status: 400, statusText: 'Bad Request' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Preço inválido.');
    expect(fixture.nativeElement.querySelector('#nome').value).toBe('Controle');
    expect(navegar).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('button[type=submit]').disabled).toBe(false);
  });
  it('rejeita nome composto somente por espaços antes do POST', () => {
    const fixture = preparar();
    const campo = fixture.nativeElement.querySelector('#nome'); campo.value = '   '; campo.dispatchEvent(new Event('input'));
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    TestBed.inject(HttpTestingController).expectNone(base);
  });
});
