export type Ponto = { nome: string; foto: string | null };

export type Servico = { nome: string; pontos: string[] };

export type Empresa = {
  nome: string;
  corClasse: string;
  servicos: Record<string, Servico>;
};

export const EMPRESAS: Record<string, Empresa> = {
  gesso: {
    nome: "Melhor Gesso",
    corClasse: "gesso",
    servicos: {
      teto: { nome: "Gesso — Teto", pontos: ["Vista geral do teto", "Canto esquerdo", "Canto direito", "Acabamento da sanca"] },
      sanca: { nome: "Gesso — Sanca", pontos: ["Sanca da sala", "Sanca do quarto", "Emenda e acabamento"] },
      rebaixamento: { nome: "Gesso — Rebaixamento", pontos: ["Estrutura metálica", "Fechamento das placas", "Nivelamento final"] },
    },
  },
  pintura: {
    nome: "Pintura Total",
    corClasse: "pintura",
    servicos: {
      geral: { nome: "Pintura Geral", pontos: ["Parede principal", "Teto", "Rodapé"] },
      cozinha: { nome: "Pintura Cozinha", pontos: ["Vista da porta", "Vista da janela", "Lavanderia"] },
      sala: { nome: "Pintura Sala", pontos: ["Parede da TV", "Parede do sofá", "Teto"] },
      quarto: { nome: "Pintura Quarto", pontos: ["Parede da cama", "Guarda-roupa", "Teto"] },
    },
  },
};

export type Status = "pendente" | "conferido" | "pendencia";

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
};

export const LANCAMENTOS_INICIAIS: Lancamento[] = [
  {
    id: "L1", empresaKey: "gesso", servicoKey: "teto", bloco: "B", apto: "304",
    terceiroNome: "Carlos Andrade", data: "22/06/2026",
    pontos: [
      { nome: "Vista geral do teto", foto: "teto_geral.jpg" },
      { nome: "Canto esquerdo", foto: "canto_esq.jpg" },
      { nome: "Canto direito", foto: null },
      { nome: "Acabamento da sanca", foto: "sanca.jpg" },
    ],
    observacao: "Segunda demão aplicada. Falta acabamento fino no canto direito.",
    status: "pendente", notaFiscal: "",
  },
  {
    id: "L2", empresaKey: "gesso", servicoKey: "teto", bloco: "B", apto: "304",
    terceiroNome: "Carlos Andrade", data: "07/06/2026",
    pontos: [
      { nome: "Vista geral do teto", foto: "teto_geral_v1.jpg" },
      { nome: "Canto esquerdo", foto: "canto_esq_v1.jpg" },
      { nome: "Canto direito", foto: "canto_dir_v1.jpg" },
      { nome: "Acabamento da sanca", foto: "sanca_v1.jpg" },
    ],
    observacao: "Início do serviço, primeira demão.",
    status: "conferido", notaFiscal: "Estrutura ok, liberado para próxima etapa.",
  },
  {
    id: "L3", empresaKey: "pintura", servicoKey: "cozinha", bloco: "A", apto: "112",
    terceiroNome: "Paulo Ricardo", data: "25/06/2026",
    pontos: [
      { nome: "Vista da porta", foto: "porta.jpg" },
      { nome: "Vista da janela", foto: "janela.jpg" },
      { nome: "Lavanderia", foto: null },
    ],
    observacao: "Faltou registrar a lavanderia, retornar amanhã.",
    status: "pendencia", notaFiscal: "Respingos de tinta no piso da lavanderia, corrigir antes de fechar o item.",
  },
  {
    id: "L4", empresaKey: "pintura", servicoKey: "sala", bloco: "C", apto: "208",
    terceiroNome: "Jorge Almeida", data: "28/06/2026",
    pontos: [
      { nome: "Parede da TV", foto: "parede_tv.jpg" },
      { nome: "Parede do sofá", foto: "parede_sofa.jpg" },
      { nome: "Teto", foto: null },
    ],
    observacao: "Pintura da sala em andamento, teto será finalizado amanhã.",
    status: "pendente", notaFiscal: "",
  },
  {
    id: "L5", empresaKey: "gesso", servicoKey: "rebaixamento", bloco: "B", apto: "210",
    terceiroNome: "Jorge Almeida", data: "27/06/2026",
    pontos: [
      { nome: "Estrutura metálica", foto: "estrutura.jpg" },
      { nome: "Fechamento das placas", foto: "fechamento.jpg" },
      { nome: "Nivelamento final", foto: "nivelamento.jpg" },
    ],
    observacao: "Rebaixamento concluído, aguardando conferência.",
    status: "conferido", notaFiscal: "Nivelamento aprovado, sem ressalvas.",
  },
];

export const STATUS_LABEL: Record<Status, string> = {
  pendente: "Pendente",
  conferido: "Conferido",
  pendencia: "Com pendência",
};
