import { IMG } from "./images";

export type Ponto = { nome: string; foto: string | null };

export type Servico = { nome: string; pontos: string[] };

export type Empresa = {
  nome: string;
  corClasse: string;
  imagem: string;
  metaMensalComodos: number; // meta de cômodos a entregar no mês, usada na barra de progresso da equipe
  servicos: Record<string, Servico>;
};

export const EMPRESAS: Record<string, Empresa> = {
  gesso: {
    nome: "Melhor Gesso",
    corClasse: "gesso",
    imagem: IMG.logoGesso,
    metaMensalComodos: 30,
    servicos: {
      teto: { nome: "100 · Gesso — Teto", pontos: ["Vista geral do teto", "Canto esquerdo", "Canto direito", "Acabamento da sanca"] },
      sanca: { nome: "200 · Gesso — Sanca", pontos: ["Sanca da sala", "Sanca do quarto", "Emenda e acabamento"] },
      rebaixamento: { nome: "300 · Gesso — Rebaixamento", pontos: ["Estrutura metálica", "Fechamento das placas", "Nivelamento final"] },
    },
  },
  pintura: {
    nome: "Pintura Total",
    corClasse: "pintura",
    imagem: IMG.logoPintura,
    metaMensalComodos: 25,
    servicos: {
      geral: { nome: "100 · Pintura — Geral", pontos: ["Parede principal", "Teto", "Rodapé"] },
      cozinha: { nome: "200 · Pintura — Cozinha", pontos: ["Vista da porta", "Vista da janela", "Lavanderia"] },
      sala: { nome: "300 · Pintura — Sala", pontos: ["Parede da TV", "Parede do sofá", "Teto"] },
      quarto: { nome: "400 · Pintura — Quarto", pontos: ["Parede da cama", "Guarda-roupa", "Teto"] },
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
    observacao: "Faltou tinta pra terminar a lavanderia — já avisei o almoxarifado, aguardando reposição pra concluir.",
    status: "pendencia", notaFiscal: "Impedimento por falta de material (tinta). Serviço parado até a reposição chegar — retomar a conferência quando a lavanderia for finalizada.",
    eventos: [
      { autor: "Paulo Ricardo", acao: "criou o lançamento", data: "25/06/2026 11:00" },
      { autor: "Paulo Ricardo", acao: "subiu novas fotos", data: "25/06/2026 11:40" },
      { autor: "Paulo Ricardo", acao: "relatou falta de material (tinta)", data: "25/06/2026 11:45" },
      { autor: "Heitor", acao: "conferiu e registrou impedimento", data: "26/06/2026 09:15" },
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
  pendente: "Verificar",
  conferido: "Conferido",
  pendencia: "Com pendência",
};

// Feed fake exibido ao terceiro ao selecionar a empresa — simula os
// lançamentos recentes de outros colegas da mesma empresa. Não é real
// (não vem de `lancamentos`), é só para dar sensação de atividade da equipe.
export type FeedItem = { autor: string; bloco: string; apto: string; servico: string; foto: string; tempo: string };

// KPIs mockados do resumo mensal exibido no topo de "fiscal-empresas" —
// não vêm do array `lancamentos`, é só para dar sensação de painel consolidado.
export type ResumoMes = {
  totalLancamentos: number;
  conferidos: number;
  aguardando: number;
  comPendencia: number;
  pendenciasAntigas: number; // pendências há mais de 5 dias sem resposta
};

// Progresso por etapa construtiva, mockado — dá ao resumo mensal uma
// visão granular ("quanto já foi feito de cada parte"), além dos KPIs gerais.
export type ProgressoEtapa = { label: string; feitas: number; total: number };

// Resumo mensal exibido em "fiscal-empresas", com um seletor de mês —
// cada chave é um mês com seus próprios KPIs e progresso por etapa mockados.
export type ResumoMensal = { label: string; resumo: ResumoMes; progresso: ProgressoEtapa[] };

export const RESUMO_MENSAL: Record<string, ResumoMensal> = {
  "2026-07": {
    label: "Julho 2026",
    resumo: {
      totalLancamentos: 47,
      conferidos: 33,
      aguardando: 9,
      comPendencia: 5,
      pendenciasAntigas: 3,
    },
    progresso: [
      { label: "Tetos", feitas: 18, total: 20 },
      { label: "Sancas", feitas: 9, total: 12 },
      { label: "Rebaixamentos", feitas: 6, total: 8 },
      { label: "Pinturas", feitas: 14, total: 20 },
    ],
  },
  "2026-06": {
    label: "Junho 2026",
    resumo: {
      totalLancamentos: 39,
      conferidos: 31,
      aguardando: 2,
      comPendencia: 6,
      pendenciasAntigas: 0,
    },
    progresso: [
      { label: "Tetos", feitas: 20, total: 20 },
      { label: "Sancas", feitas: 12, total: 12 },
      { label: "Rebaixamentos", feitas: 3, total: 8 },
      { label: "Pinturas", feitas: 9, total: 20 },
    ],
  },
};

// Empresas cujo registro do mês já foi validado manualmente (fora do app) e
// está travado — só o engenheiro responsável pode alterá-lo. Aparecem na
// tela do fiscal como consulta, sem o fluxo de lançamento por pontos/fotos.
export type EmpresaValidada = {
  nome: string;
  corClasse: string;
  metrica: string;
  engenheiroResponsavel: string;
  imagem?: string;
};

export const EMPRESAS_VALIDADAS: EmpresaValidada[] = [
  {
    nome: "Esquadrias Rocha", corClasse: "janela",
    metrica: "25 de 40 janelas entregues (62%)",
    engenheiroResponsavel: "Heitor Souza", imagem: IMG.esquadriasRocha,
  },
  {
    nome: "Metais Vaz", corClasse: "vasos",
    metrica: "18 de 40 vasos instalados (45%)",
    engenheiroResponsavel: "Heitor Souza", imagem: IMG.metaisVaz,
  },
  {
    nome: "Marcenaria Lopes", corClasse: "pia",
    metrica: "12 de 40 pias instaladas (30%)",
    engenheiroResponsavel: "Heitor Souza", imagem: IMG.marcenariaLopes,
  },
];

export const FEED_MOCK: Record<string, FeedItem[]> = {
  gesso: [
    { autor: "João Pedro", bloco: "B", apto: "202", servico: "100 · Gesso — Teto", foto: IMG.gessoTeto, tempo: "há 2 horas" },
    { autor: "Carlos Andrade", bloco: "B", apto: "304", servico: "100 · Gesso — Teto", foto: IMG.gessoInstalando, tempo: "há 5 horas" },
    { autor: "Jorge Almeida", bloco: "B", apto: "210", servico: "300 · Gesso — Rebaixamento", foto: IMG.gessoPlacas, tempo: "ontem" },
    { autor: "Ana Souza", bloco: "C", apto: "108", servico: "200 · Gesso — Sanca", foto: IMG.gessoTextura, tempo: "há 2 dias" },
  ],
  pintura: [
    { autor: "Paulo Ricardo", bloco: "A", apto: "112", servico: "200 · Pintura — Cozinha", foto: IMG.pinturaMalFeita, tempo: "há 1 hora" },
    { autor: "Jorge Almeida", bloco: "C", apto: "208", servico: "300 · Pintura — Sala", foto: IMG.paredeBrancaSala, tempo: "há 4 horas" },
    { autor: "Marina Lopes", bloco: "A", apto: "305", servico: "400 · Pintura — Quarto", foto: IMG.pinturaOk, tempo: "ontem" },
  ],
};
