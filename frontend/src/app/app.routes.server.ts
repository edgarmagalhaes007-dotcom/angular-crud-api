import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    // O catálogo administrativo deve refletir dados locais atuais.
    // O build não deve consultar nem congelar os produtos da API.
    renderMode: RenderMode.Client,
  },
];
