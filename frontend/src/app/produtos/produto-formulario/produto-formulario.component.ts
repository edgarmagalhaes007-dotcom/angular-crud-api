import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { CabecalhoComponent } from '../../compartilhado/cabecalho/cabecalho.component';
import { CarregamentoComponent } from '../../compartilhado/carregamento/carregamento.component';
import { MensagemComponent } from '../../compartilhado/mensagem/mensagem.component';
import { ProdutoEntrada } from '../produto.model';
import { ProdutoService } from '../produto.service';
import { mensagemErroApi } from '../erro-api';

const textoObrigatorio = (control: AbstractControl) =>
  typeof control.value === 'string' && control.value.trim() ? null : { required: true };

@Component({
  selector: 'app-produto-formulario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CabecalhoComponent, CarregamentoComponent, MensagemComponent, RouterLink],
  templateUrl: './produto-formulario.component.html',
})
export class ProdutoFormularioComponent implements OnInit {
  private readonly produtoService = inject(ProdutoService);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  protected carregando = false;
  protected mensagemErro = '';
  protected mensagemSucesso = '';
  protected editandoId: number | null = null;
  protected bloqueado = false;
  protected concluido = false;
  protected readonly produtoForm = this.fb.nonNullable.group({
    nome: ['', { nonNullable: true, validators: [textoObrigatorio] }],
    descricao: ['', { nonNullable: true, validators: [textoObrigatorio] }],
    categoria: ['', { nonNullable: true, validators: [textoObrigatorio] }],
    preco: this.fb.control<number | null>(null, [Validators.required, Validators.min(0.01)]),
    imagem: ['', { nonNullable: true, validators: [Validators.pattern(/^(https?:\/\/\S+)?$/)] }],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id === null) return;
    const numero = Number(id);
    if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(numero)) {
      this.bloqueado = true;
      this.mensagemErro = 'Identificador de produto inválido. Volte à lista e escolha um produto.';
      return;
    }
    this.editandoId = numero;
    this.carregando = true;
    this.bloqueado = true;
    this.produtoService.buscarPorId(numero).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => { this.carregando = false; this.cdr.markForCheck(); }),
    ).subscribe({
      next: produto => { this.produtoForm.patchValue(produto); this.bloqueado = false; },
      error: erro => { this.mensagemErro = mensagemErroApi(erro, 'carregar o produto'); },
    });
  }

  protected salvar(): void {
    if (this.carregando || this.bloqueado || this.concluido) return;
    if (this.produtoForm.invalid) { this.produtoForm.markAllAsTouched(); return; }
    const valores = this.produtoForm.getRawValue();
    if (valores.preco === null || !Number.isFinite(valores.preco)) return;
    const produto: ProdutoEntrada = {
      nome: valores.nome.trim(), descricao: valores.descricao.trim(),
      categoria: valores.categoria.trim(), preco: valores.preco, imagem: valores.imagem.trim(),
    };
    this.carregando = true;
    this.mensagemErro = '';
    this.mensagemSucesso = '';
    const requisicao = this.editandoId !== null
      ? this.produtoService.atualizar(this.editandoId, produto)
      : this.produtoService.cadastrar(produto);
    requisicao.pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => { this.carregando = false; this.cdr.markForCheck(); }),
    ).subscribe({
      next: () => {
        this.concluido = true;
        this.mensagemSucesso = this.editandoId !== null
          ? 'Produto atualizado com sucesso!' : 'Produto cadastrado com sucesso!';
        void this.router.navigate(['/produtos'], { state: { sucesso: this.mensagemSucesso } });
      },
      error: erro => { this.mensagemErro = mensagemErroApi(erro, 'salvar o produto'); },
    });
  }
}
