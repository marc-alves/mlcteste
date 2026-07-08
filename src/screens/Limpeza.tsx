import { useState } from "react";
import {
  FUNCIONARIAS_LIMPEZA,
  LIMPEZAS_INICIAIS,
  PERIODO_DIA_LABEL,
  STATUS_LIMPEZA_LABEL,
  TEMPLATES_MATERIAIS,
  TIPOS_LIMPEZA,
  type Limpeza,
  type TipoLimpezaKey,
} from "../data";
import { AlertIcon, EmptyIcon } from "../icons";

const FILTROS_TIPO: { k: "todos" | TipoLimpezaKey; label: string }[] = [
  { k: "todos", label: "Todos" },
  { k: "grossa", label: "Grossa" },
  { k: "fina", label: "Fina" },
];

const TOUR_PASSOS = [
  {
    titulo: "Como funciona a retirada",
    texto: "Você só solicita a limpeza ao almoxarifado. Quem retira o material é a própria colaboradora, por conta própria — o sistema não confirma sozinho que ela foi lá, então um item \"Aguardando retirada\" pode já ter sido buscado sem ter sido marcado ainda.",
  },
  {
    titulo: "Use os filtros",
    texto: "Filtre por tipo de limpeza, funcionária ou apartamento pra achar rápido o que procura.",
  },
  {
    titulo: "Acompanhe o status",
    texto: "Toque em qualquer card pra ver os materiais do template e o checklist de retirada daquele apartamento.",
  },
];

function TourModal({ onFechar }: { onFechar: () => void }) {
  const [passo, setPasso] = useState(0);
  const ultimo = passo === TOUR_PASSOS.length - 1;
  const atual = TOUR_PASSOS[passo];
  return (
    <div className="modal-overlay" onClick={onFechar}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon"><AlertIcon /></div>
        <h2 className="modal-title">{atual.titulo}</h2>
        <p className="modal-text">{atual.texto}</p>
        <div className="tour-dots">
          {TOUR_PASSOS.map((_, i) => (
            <span key={i} className={`tour-dot ${i === passo ? "active" : ""}`} />
          ))}
        </div>
        <div className="btn-row">
          <button className="btn btn-ghost" onClick={onFechar}>Pular</button>
          <button
            className="btn btn-primary"
            onClick={() => (ultimo ? onFechar() : setPasso((p) => p + 1))}
          >
            {ultimo ? "Entendi" : "Próximo"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DiaPeriodoChip({ l }: { l: Limpeza }) {
  return <span className="dia-chip">{l.diaSemana} · {PERIODO_DIA_LABEL[l.periodo]}</span>;
}

type LimpezaPainelProps = {
  onAbrirDetalhe: (id: string) => void;
};

export function LimpezaPainel({ onAbrirDetalhe }: LimpezaPainelProps) {
  const [filtroTipo, setFiltroTipo] = useState<"todos" | TipoLimpezaKey>("todos");
  const [filtroFuncionaria, setFiltroFuncionaria] = useState("todas");
  const [filtroApto, setFiltroApto] = useState("todos");
  const [mostrarTour, setMostrarTour] = useState(true);

  const aptos = Array.from(new Set(LIMPEZAS_INICIAIS.map((l) => `${l.bloco}/${l.apto}`))).sort();

  const lista = LIMPEZAS_INICIAIS
    .filter((l) => filtroTipo === "todos" || l.tipo === filtroTipo)
    .filter((l) => filtroFuncionaria === "todas" || l.funcionaria === filtroFuncionaria)
    .filter((l) => filtroApto === "todos" || `${l.bloco}/${l.apto}` === filtroApto)
    .sort((a, b) => b.id.localeCompare(a.id));

  return (
    <>
      <div className="eyebrow">Serviços</div>
      <h1 className="screen-title">Gerenciar limpeza</h1>
      <p className="screen-sub">
        Você solicita a limpeza ao almoxarifado — a retirada do material é feita pela própria colaboradora.
      </p>
      <button className="btn btn-ghost" style={{ marginBottom: 18 }} onClick={() => setMostrarTour(true)}>
        Fazer tour rápido
      </button>

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

      <div className="field-row">
        <div>
          <label>Funcionária</label>
          <select value={filtroFuncionaria} onChange={(e) => setFiltroFuncionaria(e.target.value)}>
            <option value="todas">Todas</option>
            {FUNCIONARIAS_LIMPEZA.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Apartamento</label>
          <select value={filtroApto} onChange={(e) => setFiltroApto(e.target.value)}>
            <option value="todos">Todos</option>
            {aptos.map((a) => (
              <option key={a} value={a}>Bloco {a.replace("/", " · Apto ")}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="section-label">Registros</div>
      {lista.length === 0 ? (
        <div className="empty-state">
          <EmptyIcon />
          <div>Nenhuma limpeza neste filtro.</div>
        </div>
      ) : (
        lista.map((l) => (
          <div key={l.id} className={`reg-card reg-card-${l.status}`} onClick={() => onAbrirDetalhe(l.id)}>
            <div className="reg-top">
              <div style={{ flex: 1 }}>
                <DiaPeriodoChip l={l} />
                <div className="reg-local">Bloco {l.bloco} · Apto {l.apto}</div>
                <div className="reg-meta">{TIPOS_LIMPEZA[l.tipo]}</div>
                <div className="reg-meta">{l.funcionaria}</div>
              </div>
              <span className={`stamp ${l.status}`}>{STATUS_LIMPEZA_LABEL[l.status]}</span>
            </div>
            {l.pendenteRedistribuicao && (
              <div className="alert-banner" style={{ marginTop: 10, marginBottom: 0 }}>
                <AlertIcon />
                <span>Pendente de redistribuição — sem responsável confirmado</span>
              </div>
            )}
            <div className="reg-data">{l.data}</div>
          </div>
        ))
      )}

      {mostrarTour && <TourModal onFechar={() => setMostrarTour(false)} />}
    </>
  );
}

type LimpezaDetalheProps = {
  limpeza: Limpeza;
};

export function LimpezaDetalhe({ limpeza: l }: LimpezaDetalheProps) {
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
            <div className="reg-meta">{TIPOS_LIMPEZA[l.tipo]}</div>
            <div className="reg-meta">{l.data} · {l.funcionaria}</div>
          </div>
          <span className={`stamp ${l.status}`}>{STATUS_LIMPEZA_LABEL[l.status]}</span>
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
