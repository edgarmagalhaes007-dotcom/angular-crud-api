# Evidências da validação

Data: 12/09/2026. Base: `b29cbb7fc8e9e8773145e095d42ff14739f8b186`.

Esta validacao foi conferida novamente na retomada final da entrega, apos a atualizacao do README e a criacao do tutorial final de GitHub/AVA.

| Verificação | Resultado observado |
|---|---|
| Instalação com os locks do backend e frontend | Concluída |
| Testes Angular / Vitest | 3 arquivos, 13 testes aprovados, 0 falhas |
| Coleção Postman pelo Newman | 13 requisições, 27 verificações, 0 falhas |
| Persistência após reiniciar API | Aprovada em dados isolados |
| Build Angular de produção | Concluído; 0 rotas pré-renderizadas |
| Tamanho inicial do build | 593,37 kB; aviso acima de 500 kB; abaixo do erro de 1 MB |
| Revisão de espaços e conflitos no diff | `git diff --check` sem erros |
| Verificação visual em navegador real | Não concluída: acesso a localhost bloqueado no navegador remoto |
| Publicação no GitHub / envio AVA | Não executados; dependem do fork público e do envio do estudante |

O arquivo `resultado-postman.json` foi produzido automaticamente pela execução. O teste não depende de prints fabricados e não altera o arquivo JSON demonstrativo da base.

Comandos executados na raiz do projeto nesta validacao:

```bash
npm run test:api
npm run test:frontend
npm run build
```

Os casos 500 e falha de rede dos testes Angular usam respostas simuladas pelo `HttpTestingController`; os retornos 200, 201, 204, 400 e 404 da coleção foram obtidos por HTTP contra a API real em execução. Não houve simulação de sucesso do servidor nos testes Newman.

A pasta Selenium da base é um exemplo original separado. Não foi executada nem contada entre os 13 testes aprovados.
