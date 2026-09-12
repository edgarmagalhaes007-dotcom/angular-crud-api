import { HttpErrorResponse } from '@angular/common/http';

/** Traduz a falha para a interface, preservando o canal error do Observable. */
export function mensagemErroApi(erro: unknown, acao: string): string {
  if (!(erro instanceof HttpErrorResponse)) return `Não foi possível ${acao}. Tente novamente.`;
  if (erro.status === 0) return 'Não foi possível conectar ao servidor. Verifique a conexão e tente novamente.';
  if (erro.status === 400) {
    return typeof erro.error?.erro === 'string'
      ? erro.error.erro
      : 'Dados inválidos. Confira os campos do formulário.';
  }
  if (erro.status === 404) return 'Produto não encontrado. Ele pode ter sido excluído. Volte à lista e atualize os dados.';
  if (erro.status >= 500) return 'O servidor encontrou um problema. Tente novamente em instantes.';
  return `Não foi possível ${acao}. Tente novamente.`;
}
