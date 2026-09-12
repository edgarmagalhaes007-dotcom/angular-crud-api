import { mkdtemp, cp, mkdir, symlink, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import assert from 'node:assert/strict';
import net from 'node:net';
import newman from 'newman';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Recusa execução se a porta da API-base já estiver em uso.
await new Promise((resolve, reject) => {
  const socket = net.createConnection({ port: 3000, host: 'localhost' });
  socket.on('connect', () => { socket.destroy(); reject(new Error('Feche a API na porta 3000 antes de executar o teste isolado.')); });
  socket.on('error', erro => erro.code === 'ECONNREFUSED' ? resolve() : reject(erro));
});
const temporario = await mkdtemp(path.join(tmpdir(), 'techstore-api-'));
let servidor;
async function iniciar() {
  servidor = spawn(process.execPath, ['src/server.js'], { cwd: temporario, stdio: ['ignore', 'pipe', 'pipe'] });
  await new Promise((resolve, reject) => {
    const limite = setTimeout(() => reject(new Error('A API não iniciou em 10 segundos.')), 10000);
    servidor.once('error', erro => { clearTimeout(limite); reject(erro); });
    servidor.once('exit', codigo => { clearTimeout(limite); reject(new Error(`API finalizada antes de iniciar: ${codigo}`)); });
    servidor.stderr.on('data', dados => process.stderr.write(dados));
    servidor.stdout.on('data', dados => { if (dados.toString().includes('Servidor rodando')) { clearTimeout(limite); resolve(); } });
  });
}
async function parar() {
  if (servidor && servidor.exitCode === null) { const terminou = once(servidor, 'exit'); servidor.kill(); await terminou; }
}
try {
  await cp(path.join(raiz, 'backend/src'), path.join(temporario, 'src'), { recursive: true });
  await mkdir(path.join(temporario, 'data'));
  await writeFile(path.join(temporario, 'data/produtos.json'), '[]\n');
  await symlink(path.join(raiz, 'backend/node_modules'), path.join(temporario, 'node_modules'), process.platform === 'win32' ? 'junction' : 'dir');
  await iniciar();
  const resposta = await fetch('http://localhost:3000/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nome: 'Persistência', descricao: 'Teste de reinício', categoria: 'Jogos', preco: 10, imagem: '' }) });
  assert.equal(resposta.status, 201);
  const criado = await resposta.json();
  const arquivo = JSON.parse(await readFile(path.join(temporario, 'data/produtos.json'), 'utf8'));
  assert.equal(arquivo[0].id, criado.id);
  await parar(); await iniciar();
  const recuperado = await fetch(`http://localhost:3000/api/products/${criado.id}`);
  assert.equal(recuperado.status, 200); assert.equal((await recuperado.json()).nome, 'Persistência');
  assert.equal((await fetch(`http://localhost:3000/api/products/${criado.id}`, { method: 'DELETE' })).status, 204);
  console.log('PASSOU: gravação no JSON e persistência após reiniciar o servidor.');
  const resumo = await new Promise((resolve, reject) => {
    newman.run({ collection: path.join(raiz, 'postman/TechStore-CRUD.postman_collection.json'), reporters: ['cli'], timeoutRequest: 5000 }, (erro, resultado) => erro ? reject(erro) : resolve(resultado));
  });
  const evidencia = { executadoEm: new Date().toISOString(), node: process.version, ambiente: 'API original executada em pasta temporária com dados isolados', persistenciaAposReinicio: true, requests: resumo.run.stats.requests, assertions: resumo.run.stats.assertions, falhas: resumo.run.failures, execucoes: resumo.run.executions.map(x => ({ nome: x.item.name, metodo: x.request.method, status: x.response?.code, testes: x.assertions?.map(a => ({ nome: a.assertion, passou: !a.error })) })) };
  await mkdir(path.join(raiz, 'docs/evidencias'), { recursive: true });
  await writeFile(path.join(raiz, 'docs/evidencias/resultado-postman.json'), JSON.stringify(evidencia, null, 2) + '\n');
  assert.equal(resumo.run.failures.length, 0, 'A coleção apresentou falhas.');
} finally { await parar(); await rm(temporario, { recursive: true, force: true }); }
