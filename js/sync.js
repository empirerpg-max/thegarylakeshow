// Ponte de comunicação entre controle.html (apresentador) e palco.html (tela compartilhada).
// Usa BroadcastChannel quando disponível, com fallback no evento "storage" do localStorage
// (necessário quando as duas janelas não compartilham o mesmo contexto de BroadcastChannel).
const NOME_CANAL = 'gary-lake-show';
const CHAVE_STORAGE = '__gary_lake_show_msg__';

const canal = 'BroadcastChannel' in window ? new BroadcastChannel(NOME_CANAL) : null;
const callbacks = [];

function notificar(mensagem) {
  callbacks.forEach((cb) => cb(mensagem));
}

if (canal) {
  canal.addEventListener('message', (evento) => notificar(evento.data));
}

window.addEventListener('storage', (evento) => {
  if (evento.key !== CHAVE_STORAGE || !evento.newValue) return;
  try {
    notificar(JSON.parse(evento.newValue));
  } catch {
    // ignora mensagens malformadas
  }
});

export function enviar(comando, dados) {
  const mensagem = { comando, dados, quando: Date.now() };
  if (canal) canal.postMessage(mensagem);
  // sempre grava no localStorage também, como fallback e para não depender só do canal
  localStorage.setItem(CHAVE_STORAGE, JSON.stringify(mensagem));
}

export function aoReceber(callback) {
  callbacks.push(callback);
}
