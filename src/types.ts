import type { Ponto } from "./data";

export type Screen =
  | "home"
  | "terceiro-nome"
  | "terceiro-empresa"
  | "terceiro-home"
  | "terceiro-registro"
  | "terceiro-local"
  | "terceiro-servico"
  | "terceiro-pontos"
  | "terceiro-revisao"
  | "terceiro-sucesso"
  | "fiscal-nome"
  | "fiscal-empresas"
  | "fiscal-lista"
  | "fiscal-detalhe"
  | "fiscal-limpeza"
  | "fiscal-limpeza-detalhe";

export type NovoLancamentoState = {
  nome: string;
  empresaKey: string | null;
  bloco: string;
  apto: string;
  servicoKey: string;
  pontos: Ponto[];
  observacao: string;
};

export const NOVO_LANCAMENTO_VAZIO: NovoLancamentoState = {
  nome: "",
  empresaKey: null,
  bloco: "",
  apto: "",
  servicoKey: "",
  pontos: [],
  observacao: "",
};

export const BACK_FLOW: Partial<Record<Screen, Screen>> = {
  "terceiro-nome": "home",
  "terceiro-empresa": "terceiro-nome",
  "terceiro-home": "terceiro-empresa",
  "terceiro-registro": "terceiro-home",
  "terceiro-local": "terceiro-home",
  "terceiro-servico": "terceiro-local",
  "terceiro-pontos": "terceiro-servico",
  "terceiro-revisao": "terceiro-pontos",
  "fiscal-nome": "home",
  "fiscal-empresas": "fiscal-nome",
  "fiscal-lista": "fiscal-empresas",
  "fiscal-detalhe": "fiscal-lista",
  "fiscal-limpeza": "fiscal-empresas",
  "fiscal-limpeza-detalhe": "fiscal-limpeza",
};

export const SCREEN_LABELS: Record<Screen, string> = {
  home: "",
  "terceiro-nome": "Novo lançamento",
  "terceiro-empresa": "Novo lançamento",
  "terceiro-home": "Início",
  "terceiro-registro": "Seu lançamento",
  "terceiro-local": "Novo lançamento",
  "terceiro-servico": "Novo lançamento",
  "terceiro-pontos": "Novo lançamento",
  "terceiro-revisao": "Revisão",
  "terceiro-sucesso": "",
  "fiscal-nome": "Fiscalização",
  "fiscal-empresas": "Fiscalização",
  "fiscal-lista": "Fiscalização",
  "fiscal-detalhe": "Registro",
  "fiscal-limpeza": "Limpeza",
  "fiscal-limpeza-detalhe": "Limpeza",
};
