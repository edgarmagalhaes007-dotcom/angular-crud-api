import { CommonModule } from '@angular/common';
import { Component, inject, ChangeDetectorRef, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { finalize, switchMap } from 'rxjs';
import { CabecalhoComponent } from '../../compartilhado/cabecalho/cabecalho.component';
import { CarregamentoComponent } from '../../compartilhado/carregamento/carregamento.component';
import { MensagemComponent } from '../../compartilhado/mensagem/mensagem.component';
import { Produto } from '../produto.model';
import { ProdutoService } from '../produto.service';
import { mensagemErroApi } from '../erro-api';

@Component({
  selector: 'app-lista-produtos',
  standalone: true,
  imports: [CommonModule, CabecalhoComponent, CarregamentoComponent, MensagemComponent, RouterLink],
  templateUrl: './lista-produtos.component.html',
  styleUrl: './lista-produtos.component.css',
})
export class ListaProdutosComponent implements OnInit {
  private readonly produtoService = inject(ProdutoService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  protected produtos: Produto[] = [];
  protected carregando = false;
  protected mensagemErro = '';
  protected mensagemSucesso = this.router.currentNavigation()?.extras.state?.['sucesso'] ?? '';

  ngOnInit(): void { this.carregarProdutos(); }

  protected carregarProdutos(): void {
    if (this.carregando) return;
    this.carregando = true;
    this.mensagemErro = '';
    this.produtoService.listar().pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => { this.carregando = false; this.cdr.markForCheck(); }),
    ).subscribe({
      next: produtos => { this.produtos = produtos; },
      error: erro => { this.mensagemErro = mensagemErroApi(erro, 'carregar os produtos'); },
    });
  }

  protected imagemAlternativa(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (!img.src.endsWith('/sem-imagem.svg')) img.src = 'sem-imagem.svg';
  }

  protected excluir(id: number): void {
    if (this.carregando || !confirm('Tem certeza que deseja excluir este produto?')) return;
    this.carregando = true;
    this.mensagemErro = '';
    this.mensagemSucesso = '';
    this.produtoService.excluir(id).pipe(
      switchMap(() => {
        this.produtos = this.produtos.filter(produto => produto.id !== id);
        this.mensagemSucesso = 'Produto excluído com sucesso!';
        return this.produtoService.listar();
      }),
      takeUntilDestroyed(this.destroyRef),
      finalize(() => { this.carregando = false; this.cdr.markForCheck(); }),
    ).subscribe({
      next: produtos => { this.produtos = produtos; },
      error: erro => {
        this.mensagemErro = mensagemErroApi(erro, this.mensagemSucesso ? 'atualizar a lista' : 'excluir o produto');
      },
    });
  }
}
