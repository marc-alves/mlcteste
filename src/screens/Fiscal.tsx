import { useState } from "react";
import { EMPRESAS, STATUS_LABEL, type Lancamento, type Status } from "../data";
import { CheckIcon, EmptyIcon } from "../icons";

type FiscalNomeProps = {
  fiscalNome: string;
  onConfirm: (nome: string) => void;
};

export function FiscalNome({ fiscalNome, onConfirm }: FiscalNomeProps) {
  const [value, setValue] = useState(fiscalNome);
  const confirmar = () => {
    const v = value.trim();
    if (!v) {
      alert("Digite seu nome para continuar.");
      return;
    }
    onConfirm(v);
  };
  return (
    <>
      <div className="eyebrow">Identificação</div>
      <h1 className="screen-title">Como você se chama?</h1>
      <p className="screen-sub">Seu nome fica associado às conferências que você realizar.</p>
      <label>Nome completo</label>
      <input type="text" placeholder="Ex.: Maria L." value={value} onChange={(e) => setValue(e.target.value)} />
      <div className="bottombar">
        <button className="btn btn-primary" onClick={confirmar}>Ver lançamentos</button>
      </div>
    </>
  );
}

type FiscalEmpresasProps = {
  fiscalNome: string;
  lancamentos: Lancamento[];
  onAbrirEmpresa: (key: string) => void;
};

export function FiscalEmpresas({ fiscalNome, lancamentos, onAbrirEmpresa }: FiscalEmpresasProps) {
  return (
    <>
      <div className="eyebrow">Olá, {fiscalNome.split(" ")[0]}</div>
      <h1 className="screen-title">Qual empresa você quer conferir?</h1>
      <p className="screen-sub">Selecione a empresa para ver os lançamentos feitos por cada responsável.</p>
      {Object.keys(EMPRESAS).map((key) => {
        const e = EMPRESAS[key];
        const regs = lancamentos.filter((l) => l.empresaKey === key);
        const pendentes = regs.filter((l) => l.status === "pendente").length;
        return (
          <div key={key} className="empresa-card" onClick={() => onAbrirEmpresa(key)}>
            <div className={`empresa-dot ${e.corClasse}`} />
            <div>
              <strong>{e.nome}</strong>
              <span>
                {regs.length} lançamento{regs.length === 1 ? "" : "s"} · {pendentes} pendente{pendentes === 1 ? "" : "s"} de conferência
              </span>
            </div>
          </div>
        );
      })}
    </>
  );
}

const FILTROS: { k: "todos" | Status; label: string }[] = [
  { k: "todos", label: "Todos" },
  { k: "pendente", label: "Pendente" },
  { k: "conferido", label: "Conferido" },
  { k: "pendencia", label: "Com pendência" },
];

type FiscalListaProps = {
  empresaKey: string;
  lancamentos: Lancamento[];
  filtroStatus: "todos" | Status;
  onFiltroChange: (f: "todos" | Status) => void;
  onAbrirDetalhe: (id: string) => void;
};

export function FiscalLista({ empresaKey, lancamentos, filtroStatus, onFiltroChange, onAbrirDetalhe }: FiscalListaProps) {
  const emp = EMPRESAS[empresaKey];
  const lista = lancamentos.filter((l) => l.empresaKey === empresaKey && (filtroStatus === "todos" || l.status === filtroStatus));
  return (
    <>
      <div className="eyebrow">{emp.nome}</div>
      <h1 className="screen-title">Lançamentos por responsável</h1>
      <p className="screen-sub">Toque em um registro para conferir os detalhes.</p>
      <div className="filtros">
        {FILTROS.map((f) => (
          <div
            key={f.k}
            className={`filtro-chip ${filtroStatus === f.k ? "active" : ""}`}
            onClick={() => onFiltroChange(f.k)}
          >
            {f.label}
          </div>
        ))}
      </div>
      {lista.length === 0 ? (
        <div className="empty-state">
          <EmptyIcon />
          <div>Nenhum lançamento neste filtro ainda.</div>
        </div>
      ) : (
        lista.map((l) => {
          const serv = emp.servicos[l.servicoKey];
          return (
            <div key={l.id} className={`reg-card reg-card-${l.status}`} onClick={() => onAbrirDetalhe(l.id)}>
              <div className="reg-top">
                <div>
                  <div className="reg-local">Bloco {l.bloco} · Apto {l.apto}</div>
                  <div className="reg-meta"><strong>{l.terceiroNome}</strong> lançou — {serv.nome}</div>
                </div>
                <span className={`stamp ${l.status}`}>{STATUS_LABEL[l.status]}</span>
              </div>
              <div className="reg-data">{l.data}</div>
            </div>
          );
        })
      )}
    </>
  );
}

type FiscalDetalheProps = {
  lancamento: Lancamento;
  todos: Lancamento[];
  onMarcarConferido: (nota: string) => void;
  onRegistrarPendencia: (nota: string) => void;
  onReabrirConferencia: () => void;
};

export function FiscalDetalhe({ lancamento: l, todos, onMarcarConferido, onRegistrarPendencia, onReabrirConferencia }: FiscalDetalheProps) {
  const [nota, setNota] = useState(l.notaFiscal || "");
  const emp = EMPRESAS[l.empresaKey];
  const serv = emp.servicos[l.servicoKey];

  const historico = todos
    .filter((x) => x.bloco === l.bloco && x.apto === l.apto && x.servicoKey === l.servicoKey && x.empresaKey === l.empresaKey)
    .sort((a, b) => a.id.localeCompare(b.id));

  const registrarPendencia = () => {
    const v = nota.trim();
    if (!v) {
      alert("Descreva a pendência antes de registrar.");
      return;
    }
    onRegistrarPendencia(v);
  };

  return (
    <>
      <div className="detail-header">
        <div className="reg-top" style={{ marginBottom: 0 }}>
          <div>
            <div className="reg-local">Bloco {l.bloco} · Apto {l.apto}</div>
            <div className="reg-meta">{emp.nome} — {serv.nome}</div>
            <div className="reg-meta">{l.data} · lançado por {l.terceiroNome}</div>
          </div>
          <span className={`stamp ${l.status}`}>{STATUS_LABEL[l.status]}</span>
        </div>
      </div>

      <div className="section-label">Pontos de verificação</div>
      {l.pontos.map((p) => (
        <div key={p.nome} className="pt-item">
          <span className="pt-name">{p.nome}</span>
          {p.foto ? (
            <span className="pt-status-ok"><CheckIcon /> {p.foto}</span>
          ) : (
            <span className="pt-status-off">sem foto</span>
          )}
        </div>
      ))}

      {l.observacao && (
        <>
          <div className="section-label">Observação do terceiro</div>
          <div className="obs-box">{l.observacao}</div>
        </>
      )}

      <div className="section-label">Histórico deste serviço · {l.bloco}/{l.apto}</div>
      {historico.map((h) => (
        <div key={h.id} className="hist-item">
          <span>{h.data} — {h.terceiroNome}</span>
          <span className={`stamp ${h.status}`} style={{ transform: "none", padding: "2px 8px" }}>{STATUS_LABEL[h.status]}</span>
        </div>
      ))}

      <div className="section-label">Conferência</div>
      {l.status === "conferido" ? (
        <>
          <div className="obs-box" style={{ background: "var(--primary-soft)", color: "var(--primary-dark)" }}>
            <strong>Nota da fiscalização:</strong><br />{l.notaFiscal || "—"}
          </div>
          <button className="btn btn-ghost" onClick={onReabrirConferencia}>Reabrir conferência</button>
        </>
      ) : (
        <>
          <label>Nota da fiscalização (opcional para aprovar, obrigatória para pendência)</label>
          <textarea
            placeholder="Ex.: Estrutura ok, liberado para próxima etapa."
            value={nota}
            onChange={(e) => setNota(e.target.value)}
          />
          <div className="btn-row">
            <button className="btn btn-outline" onClick={registrarPendencia}>Registrar pendência</button>
            <button className="btn btn-primary" onClick={() => onMarcarConferido(nota.trim())}>Marcar conferido</button>
          </div>
        </>
      )}
      <div style={{ height: 20 }} />
    </>
  );
}
