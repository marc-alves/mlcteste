import { IMG } from "./images";

export type Ponto = { nome: string; foto: string | null };

export type Servico = { nome: string; pontos: string[] };

export type Empresa = {
  nome: string;
  corClasse: string;
  imagem: string;
  servicos: Record<string, Servico>;
};

export const EMPRESAS: Record<string, Empresa> = {
  gesso: {
    nome: "Melhor Gesso",
    corClasse: "gesso",
    imagem: IMG.gessoInstalando,
    servicos: {
      teto: { nome: "Gesso — Teto", pontos: ["Vista geral do teto", "Canto esquerdo", "Canto direito", "Acabamento da sanca"] },
      sanca: { nome: "Gesso — Sanca", pontos: ["Sanca da sala", "Sanca do quarto", "Emenda e acabamento"] },
      rebaixamento: { nome: "Gesso — Rebaixamento", pontos: ["Estrutura metálica", "Fechamento das placas", "Nivelamento final"] },
    },
  },
  pintura: {
    nome: "Pintura Total",
    corClasse: "pintura",
    imagem: IMG.pinturaOk,
    servicos: {
      geral: { nome: "Pintura Geral", pontos: ["Parede principal", "Teto", "Rodapé"] },
      cozinha: { nome: "Pintura Cozinha", pontos: ["Vista da porta", "Vista da janela", "Lavanderia"] },
      sala: { nome: "Pintura Sala", pontos: ["Parede da TV", "Parede do sofá", "Teto"] },
      quarto: { nome: "Pintura Quarto", pontos: ["Parede da cama", "Guarda-roupa", "Teto"] },
    },
  },
};

export type Status = "pendente" | "conferido" | "pendencia";

export type Evento = { autor: string; acao: string; data: string };

export function criarEvento(autor: string, acao: string): Evento {
  const agora = new Date();
  const data = agora.toLocaleDateString("pt-BR");
  const hora = agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return { autor, acao, data: `${data} ${hora}` };
}

export type Lancamento = {
  id: string;
  empresaKey: string;
  servicoKey: string;
  bloco: string;
  apto: string;
  terceiroNome: string;
  data: string;
  pontos: Ponto[];
  observacao: string;
  status: Status;
  notaFiscal: string;
  eventos: Evento[];
};

export const LANCAMENTOS_INICIAIS: Lancamento[] = [
  {
    id: "L1", empresaKey: "gesso", servicoKey: "teto", bloco: "B", apto: "304",
    terceiroNome: "Carlos Andrade", data: "22/06/2026",
    pontos: [
      { nome: "Vista geral do teto", foto: IMG.gessoTeto },
      { nome: "Canto esquerdo", foto: IMG.gessoInstalando },
      { nome: "Canto direito", foto: null },
      { nome: "Acabamento da sanca", foto: IMG.gessoTextura },
    ],
    observacao: "Gesso ainda sendo instalado. Falta acabamento fino no canto direito.",
    status: "pendente", notaFiscal: "",
    eventos: [
      { autor: "Carlos Andrade", acao: "criou o lançamento", data: "22/06/2026 08:50" },
      { autor: "Carlos Andrade", acao: "subiu novas fotos", data: "22/06/2026 09:30" },
    ],
  },
  {
    id: "L2", empresaKey: "gesso", servicoKey: "teto", bloco: "B", apto: "304",
    terceiroNome: "Carlos Andrade", data: "07/06/2026",
    pontos: [
      { nome: "Vista geral do teto", foto: IMG.gessoTeto },
      { nome: "Canto esquerdo", foto: IMG.gessoInstalando },
      { nome: "Canto direito", foto: IMG.gessoInstalando },
      { nome: "Acabamento da sanca", foto: IMG.gessoTextura },
    ],
    observacao: "Início do serviço, instalação das placas de gesso.",
    status: "conferido", notaFiscal: "Estrutura ok, liberado para próxima etapa.",
    eventos: [
      { autor: "Carlos Andrade", acao: "criou o lançamento", data: "07/06/2026 10:05" },
      { autor: "Heitor", acao: "conferiu o lançamento", data: "08/06/2026 16:20" },
    ],
  },
  {
    id: "L3", empresaKey: "pintura", servicoKey: "cozinha", bloco: "A", apto: "112",
    terceiroNome: "Paulo Ricardo", data: "25/06/2026",
    pontos: [
      { nome: "Vista da porta", foto: IMG.pinturaOk },
      { nome: "Vista da janela", foto: IMG.pinturaMalFeita },
      { nome: "Lavanderia", foto: null },
    ],
    observacao: "Faltou registrar a lavanderia, retornar amanhã.",
    status: "pendencia", notaFiscal: "Pintura da janela com falhas visíveis e respingos de tinta no piso da lavanderia. Corrigir antes de fechar o item.",
    eventos: [
      { autor: "Paulo Ricardo", acao: "criou o lançamento", data: "25/06/2026 11:00" },
      { autor: "Paulo Ricardo", acao: "subiu novas fotos", data: "25/06/2026 11:40" },
      { autor: "Heitor", acao: "conferiu e registrou pendência", data: "26/06/2026 09:15" },
    ],
  },
  {
    id: "L4", empresaKey: "pintura", servicoKey: "sala", bloco: "C", apto: "208",
    terceiroNome: "Jorge Almeida", data: "28/06/2026",
    pontos: [
      { nome: "Parede da TV", foto: IMG.paredeBrancaSala },
      { nome: "Parede do sofá", foto: IMG.pinturaOk },
      { nome: "Teto", foto: null },
    ],
    observacao: "Pintura da sala em andamento, teto será finalizado amanhã.",
    status: "pendente", notaFiscal: "",
    eventos: [
      { autor: "Jorge Almeida", acao: "criou o lançamento", data: "28/06/2026 14:00" },
      { autor: "Jorge Almeida", acao: "subiu novas fotos", data: "28/06/2026 14:32" },
    ],
  },
  {
    id: "L5", empresaKey: "gesso", servicoKey: "rebaixamento", bloco: "B", apto: "210",
    terceiroNome: "Jorge Almeida", data: "27/06/2026",
    pontos: [
      { nome: "Estrutura metálica", foto: IMG.gessoInstalando },
      { nome: "Fechamento das placas", foto: IMG.gessoPlacas },
      { nome: "Nivelamento final", foto: IMG.fotoMisteriosa },
    ],
    observacao: "Rebaixamento concluído, aguardando conferência.",
    status: "conferido", notaFiscal: "Nivelamento aprovado, sem ressalvas.",
    eventos: [
      { autor: "Jorge Almeida", acao: "criou o lançamento", data: "27/06/2026 08:30" },
      { autor: "Jorge Almeida", acao: "subiu novas fotos", data: "27/06/2026 09:10" },
      { autor: "Heitor", acao: "conferiu o lançamento", data: "27/06/2026 17:45" },
    ],
  },
];

export const STATUS_LABEL: Record<Status, string> = {
  pendente: "Pendente",
  conferido: "Conferido",
  pendencia: "Com pendência",
};
