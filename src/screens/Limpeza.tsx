import { useState } from "react";
import {
  FUNCIONARIAS_LIMPEZA,
  PERIODO_DIA_LABEL,
  PRESENCA_SEMANA,
  STATUS_LIMPEZA_LABEL,
  STATUS_LIMPEZA_ORDEM,
  TEMPLATES_MATERIAIS,
  TIPOS_LIMPEZA,
  type Limpeza,
  type StatusLimpeza,
  type TipoLimpezaKey,
} from "../data";
import { AlertIcon, ChevronDownIcon } from "../icons";

const FILTROS_TIPO: { k: "todos" | TipoLimpezaKey; label: string }[] = [
  { k: "todos", label: "Todos" },
  { k: "grossa", label: "Grossa" },
  { k: "fina", label: "Fina" },
];

const FILTROS_DIA = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

function DiaPeriodoChip({ l }: { l: Limpeza }) {
  return <span className="dia-chip">{l.diaSemana}, {l.data.slice(0, 5)} · {PERIODO_DIA_LABEL[l.periodo]}</span>;
}

function parseDataBr(data: string): number {
  const [d, m, y] = data.split("/").map(Number);
  return new Date(y, m - 1, d).getTime();
}

function StatusStamp({ l, onMudarStatus }: { l: Limpeza; onMudarStatus: (novo: StatusLimpeza) => void }) {
  return (
    <span className={`stamp stamp-select-wrap ${l.status}`} onClick={(e) => e.stopPropagation()}>
      <select
        className="stamp-select"
        value={l.status}
        onChange={(e) => onMudarStatus(e.target.value as StatusLimpeza)}
      >
        {STATUS_LIMPEZA_ORDEM.map((s) => (
          <option key={s} value={s}>{STATUS_LIMPEZA_LABEL[s]}</option>
        ))}
      </select>
    </span>
  );
}

type PessoaCardProps = {
  nome: string;
  presente?: boolean;
  atribuicoes: Limpeza[];
  filtroDia: string;
  onMudarStatus: (id: string, novoStatus: StatusLimpeza) => void;
  onAbrirDetalhe: (id: string) => void;
};

function PessoaCard({ nome, presente, atribuicoes, filtroDia, onMudarStatus, onAbrirDetalhe }: PessoaCardProps) {
  const [aberto, setAberto] = useState(false);

  return (
    <div className={`pessoa-card ${presente === false ? "ausente" : ""}`}>
      <div className="pessoa-card-head" onClick={() => setAberto((a) => !a)}>
        <span className="pessoa-nome">{nome}</span>
        <div className="pessoa-card-head-right">
          {presente !== undefined && (
            <span className={`presenca-tag ${presente ? "presente" : "ausente"}`}>
              {presente ? "Presente" : "Ausente"}
            </span>
          )}
          <span className={`pessoa-chevron ${aberto ? "aberto" : ""}`}><ChevronDownIcon /></span>
        </div>
      </div>

      {aberto && (
        atribuicoes.length === 0 ? (
          <div className="pessoa-vazio">
            Nenhuma limpeza atribuída{filtroDia !== "Todos" ? ` na ${filtroDia}` : ""}.
          </div>
        ) : (
          atribuicoes.map((l) => (
            <div key={l.id} className="pessoa-linha" onClick={() => onAbrirDetalhe(l.id)}>
              <div>
                <DiaPeriodoChip l={l} />
                <div className="reg-local">Bloco {l.bloco} · Apto {l.apto}</div>
                <div className="reg-meta">{TIPOS_LIMPEZA[l.tipo]}</div>
              </div>
              <StatusStamp l={l} onMudarStatus={(novo) => onMudarStatus(l.id, novo)} />
            </div>
          ))
        )
      )}

      {aberto && atribuicoes.some((l) => l.pendenteRedistribuicao) && (
        <div className="alert-banner" style={{ marginTop: 4, marginBottom: 0 }}>
          <AlertIcon />
          <span>Pendente de redistribuição — sem responsável confirmado</span>
        </div>
      )}
    </div>
  );
}

type LimpezaPainelProps = {
  limpezas: Limpeza[];
  onMudarStatus: (id: string, novoStatus: StatusLimpeza) => void;
  onAbrirDetalhe: (id: string) => void;
};

export function LimpezaPainel({ limpezas, onMudarStatus, onAbrirDetalhe }: LimpezaPainelProps) {
  const [filtroTipo, setFiltroTipo] = useState<"todos" | TipoLimpezaKey>("todos");
  const [filtroDia, setFiltroDia] = useState("Todos");

  const pessoas = FUNCIONARIAS_LIMPEZA.map((nome) => {
    const atribuicoes = limpezas
      .filter((l) => l.funcionaria === nome)
      .filter((l) => filtroTipo === "todos" || l.tipo === filtroTipo)
      .filter((l) => filtroDia === "Todos" || l.diaSemana === filtroDia)
      .sort((a, b) => parseDataBr(a.data) - parseDataBr(b.data) || a.periodo.localeCompare(b.periodo));
    const presente = filtroDia !== "Todos" ? PRESENCA_SEMANA[nome]?.[filtroDia] : undefined;
    return { nome, atribuicoes, presente };
  });

  return (
    <>
      <div className="eyebrow">Serviços</div>
      <h1 className="screen-title">Gerenciar limpeza</h1>
      <p className="screen-sub">
        Você solicita a limpeza ao almoxarifado — a retirada do material é feita pela própria colaboradora.
      </p>

      <div className="filtros" style={{ flexWrap: "wrap" }}>
        {FILTROS_DIA.map((d) => (
          <div
            key={d}
            className={`filtro-chip ${filtroDia === d ? "active" : ""}`}
            onClick={() => setFiltroDia(filtroDia === d ? "Todos" : d)}
          >
            {d}
          </div>
        ))}
      </div>

      <div className="filtros">
        {FILTROS_TIPO.map((f) => (
          <div
            key={f.k}
            className={`filtro-chip ${filtroTipo === f.k ? "active" : ""}`}
            onClick={() => setFiltroTipo(f.k)}
          >
            {f.label}
          </div>
        ))}
      </div>

      <div className="section-label">Equipe</div>
      {pessoas.map((p) => (
        <PessoaCard
          key={p.nome}
          nome={p.nome}
          presente={p.presente}
          atribuicoes={p.atribuicoes}
          filtroDia={filtroDia}
          onMudarStatus={onMudarStatus}
          onAbrirDetalhe={onAbrirDetalhe}
        />
      ))}
    </>
  );
}

type LimpezaDetalheProps = {
  limpeza: Limpeza;
  onMudarStatus: (novoStatus: StatusLimpeza) => void;
};

export function LimpezaDetalhe({ limpeza: l, onMudarStatus }: LimpezaDetalheProps) {
  const materiais = TEMPLATES_MATERIAIS[l.tipo];
  const aSolicitar = l.status === "a_solicitar";
  const retirado = !!l.retiradoEm;
  const emAndamento = l.status === "em_andamento";

  const passos: { label: string; feito: boolean; detalhe?: string }[] = [
    {
      label: aSolicitar ? "Falta solicitar ao almoxarifado" : "Solicitado ao almoxarifado",
      feito: !aSolicitar,
      detalhe: aSolicitar ? undefined : `${l.diaSemana}, ${l.data}`,
    },
    {
      label: retirado ? "Retirado pela colaboradora" : "Aguardando confirmação da colaboradora",
      feito: retirado,
      detalhe: l.retiradoEm,
    },
    {
      label: "Limpeza em andamento",
      feito: emAndamento,
    },
  ];

  return (
    <>
      <div className="detail-header">
        <div className="reg-top" style={{ marginBottom: 0 }}>
          <div>
            <DiaPeriodoChip l={l} />
            <div className="reg-local">Bloco {l.bloco} · Apto {l.apto}</div>
            <div className="reg-meta">{TIPOS_LIMPEZA[l.tipo]} · {l.funcionaria}</div>
          </div>
          <StatusStamp l={l} onMudarStatus={onMudarStatus} />
        </div>
      </div>

      {aSolicitar && (
        <div className="obs-box">
          Ainda dá tempo — essa limpeza ainda não foi solicitada ao almoxarifado. Solicite quando for conveniente ao longo do dia.
        </div>
      )}

      {l.pendenteRedistribuicao && (
        <div className="alert-banner">
          <AlertIcon />
          <span>Pendente de redistribuição — a funcionária escalada está ausente e este item ainda não tem responsável confirmado.</span>
        </div>
      )}

      {!aSolicitar && !retirado && !l.pendenteRedistribuicao && (
        <div className="obs-box">
          Você só vê aqui se a colaboradora confirmou a retirada — sem essa confirmação, não há como saber se ela já buscou o material ou não.
        </div>
      )}

      <div className="section-label">Checklist de retirada</div>
      <div className="timeline">
        {passos.map((p, i) => (
          <div key={p.label} className="timeline-item">
            <div className="timeline-marker">
              <span className={`timeline-dot ${p.feito ? "" : "timeline-dot-pending"}`} />
              {i < passos.length - 1 && <span className="timeline-line" />}
            </div>
            <div className="timeline-body">
              <span className={`timeline-text ${p.feito ? "" : "timeline-text-pending"}`}>{p.label}</span>
              {p.detalhe && <span className="timeline-date">{p.detalhe}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="section-label">Materiais (template · {TIPOS_LIMPEZA[l.tipo]})</div>
      {materiais.map((m) => (
        <div key={m} className="material-item">
          <span className="material-bullet" />
          {m}
        </div>
      ))}
    </>
  );
}
