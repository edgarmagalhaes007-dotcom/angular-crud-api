export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  categoria: string;
  preco: number;
  imagem: string;
}

// O identificador é atribuído pela API, nunca pelo formulário.
export type ProdutoEntrada = Omit<Produto, 'id'>;
