import { useState } from "react";
import { EMPRESAS } from "../data";
import { CameraIcon, CheckIcon } from "../icons";
import type { NovoLancamentoState } from "../types";

type StepProps = {
  novo: NovoLancamentoState;
  setNovo: (update: Partial<NovoLancamentoState>) => void;
  onNext: () => void;
};

export function TerceiroNome({ novo, setNovo, onNext }: StepProps) {
  const [value, setValue] = useState(novo.nome);
  const confirmar = () => {
    const v = value.trim();
    if (!v) {
      alert("Digite seu nome para continuar.");
      return;
    }
    setNovo({ nome: v });
    onNext();
  };
  return (
    <>
      <div className="eyebrow">Passo 1 de 5</div>
      <h1 className="screen-title">Como você se chama?</h1>
      <p className="screen-sub">Usamos seu nome para identificar quem fez o lançamento.</p>
      <label>Nome completo</label>
      <input type="text" placeholder="Ex.: Carlos Andrade" value={value} onChange={(e) => setValue(e.target.value)} />
      <div className="bottombar">
        <button className="btn btn-primary" onClick={confirmar}>Continuar</button>
      </div>
    </>
  );
}

export function TerceiroEmpresa({ novo, setNovo, onNext }: StepProps) {
  const cards = Object.keys(EMPRESAS).map((key) => {
    const e = EMPRESAS[key];
    const sel = novo.empresaKey === key ? "selected" : "";
    return (
      <div key={key} className={`empresa-card ${sel}`} onClick={() => setNovo({ empresaKey: key, servicoKey: "" })}>
        <div className={`empresa-dot ${e.corClasse}`} />
        <div>
          <strong>{e.nome}</strong>
          <span>{Object.keys(e.servicos).length} tipos de serviço</span>
        </div>
      </div>
    );
  });
  return (
    <>
      <div className="eyebrow">Passo 2 de 5</div>
      <h1 className="screen-title">Qual empresa, {novo.nome.split(" ")[0]}?</h1>
      <p className="screen-sub">Selecione a empresa responsável pelo lançamento.</p>
      {cards}
      <div className="bottombar">
        <button className="btn btn-primary" disabled={!novo.empresaKey} onClick={onNext}>Continuar</button>
      </div>
    </>
  );
}

export function TerceiroLocal({ novo, setNovo, onNext }: StepProps) {
  const [bloco, setBloco] = useState(novo.bloco);
  const [apto, setApto] = useState(novo.apto);
  const confirmar = () => {
    const b = bloco.trim();
    const a = apto.trim();
    if (!b || !a) {
      alert("Preencha bloco e apartamento.");
      return;
    }
    setNovo({ bloco: b, apto: a });
    onNext();
  };
  return (
    <>
      <div className="eyebrow">Passo 3 de 5</div>
      <h1 className="screen-title">Onde foi o serviço?</h1>
      <p className="screen-sub">Informe o bloco e o apartamento do lançamento.</p>
      <div className="field-row">
        <div>
          <label>Bloco</label>
          <input type="text" placeholder="Ex.: B" value={bloco} onChange={(e) => setBloco(e.target.value)} />
        </div>
        <div>
          <label>Apartamento</label>
          <input type="text" placeholder="Ex.: 304" value={apto} onChange={(e) => setApto(e.target.value)} />
        </div>
      </div>
      <div className="bottombar">
        <button className="btn btn-primary" onClick={confirmar}>Continuar</button>
      </div>
    </>
  );
}

export function TerceiroServico({ novo, setNovo, onNext }: StepProps) {
  const [value, setValue] = useState(novo.servicoKey);
  if (!novo.empresaKey) return null;
  const servicos = EMPRESAS[novo.empresaKey].servicos;
  const confirmar = () => {
    if (!value) {
      alert("Selecione o tipo de serviço.");
      return;
    }
    const pontosBase = servicos[value].pontos;
    setNovo({ servicoKey: value, pontos: pontosBase.map((nome) => ({ nome, foto: null })) });
    onNext();
  };
  return (
    <>
      <div className="eyebrow">Passo 4 de 5</div>
      <h1 className="screen-title">Tipo de serviço</h1>
      <p className="screen-sub">Selecione o serviço prestado em {EMPRESAS[novo.empresaKey].nome}.</p>
      <label>Serviço</label>
      <select value={value} onChange={(e) => setValue(e.target.value)}>
        <option value="">Selecione...</option>
        {Object.keys(servicos).map((k) => (
          <option key={k} value={k}>{servicos[k].nome}</option>
        ))}
      </select>
      <div className="bottombar">
        <button className="btn btn-primary" onClick={confirmar}>Continuar</button>
      </div>
    </>
  );
}

export function TerceiroPontos({ novo, setNovo, onNext }: StepProps) {
  const [obs, setObs] = useState(novo.observacao);
  if (!novo.empresaKey) return null;
  const servico = EMPRESAS[novo.empresaKey].servicos[novo.servicoKey];

  const anexarFoto = (i: number, files: FileList | null) => {
    const nome = files && files[0] ? files[0].name : "foto.jpg";
    const pontos = novo.pontos.map((p, idx) => (idx === i ? { ...p, foto: nome } : p));
    setNovo({ pontos });
  };

  const revisar = () => {
    setNovo({ observacao: obs.trim() });
    onNext();
  };

  return (
    <>
      <div className="eyebrow">Passo 5 de 5</div>
      <h1 className="screen-title">Pontos de verificação</h1>
      <p className="screen-sub">Registre uma foto para cada ponto do serviço "{servico.nome}".</p>
      {novo.pontos.map((p, i) => (
        <div key={p.nome} className="ponto-card">
          <div className="ponto-head">
            <strong>{p.nome}</strong>
            {p.foto && <span className="pt-status-ok"><CheckIcon /> anexada</span>}
          </div>
          <label className={`foto-btn ${p.foto ? "ok" : ""}`} htmlFor={`file${i}`}>
            <CameraIcon /> {p.foto ? p.foto : "Anexar foto deste ponto"}
          </label>
          <input
            type="file"
            id={`file${i}`}
            accept="image/*"
            capture="environment"
            style={{ display: "none" }}
            onChange={(e) => anexarFoto(i, e.target.files)}
          />
        </div>
      ))}
      <label style={{ marginTop: 6 }}>Observação (opcional)</label>
      <textarea
        placeholder="Alguma informação adicional sobre o lançamento..."
        value={obs}
        onChange={(e) => setObs(e.target.value)}
      />
      <div className="bottombar">
        <button className="btn btn-primary" onClick={revisar}>Revisar lançamento</button>
      </div>
    </>
  );
}

export function TerceiroRevisao({ novo, onNext }: StepProps) {
  if (!novo.empresaKey) return null;
  const emp = EMPRESAS[novo.empresaKey];
  const serv = emp.servicos[novo.servicoKey];
  return (
    <>
      <div className="eyebrow">Confirmar antes de enviar</div>
      <h1 className="screen-title">Revisão do lançamento</h1>
      <div className="detail-header">
        <div className="reg-local">Bloco {novo.bloco} · Apto {novo.apto}</div>
        <div className="reg-meta">{emp.nome} — {serv.nome}</div>
        <div className="reg-meta">Lançado por {novo.nome}</div>
      </div>
      <div className="section-label">Pontos de verificação</div>
      {novo.pontos.map((p) => (
        <div key={p.nome} className="pt-item">
          <span className="pt-name">{p.nome}</span>
          {p.foto ? (
            <span className="pt-status-ok"><CheckIcon /> {p.foto}</span>
          ) : (
            <span className="pt-status-off">sem foto</span>
          )}
        </div>
      ))}
      {novo.observacao && (
        <>
          <div className="section-label">Observação</div>
          <div className="obs-box">{novo.observacao}</div>
        </>
      )}
      <div className="bottombar">
        <button className="btn btn-primary" onClick={onNext}>Enviar lançamento</button>
      </div>
    </>
  );
}

type SucessoProps = {
  bloco: string;
  apto: string;
  onNovoLancamento: () => void;
  onVoltarInicio: () => void;
};

export function TerceiroSucesso({ bloco, apto, onNovoLancamento, onVoltarInicio }: SucessoProps) {
  return (
    <div className="success-wrap">
      <div className="success-stamp"><span>ENVIADO</span></div>
      <h1 className="screen-title">Lançamento registrado</h1>
      <p className="screen-sub">
        Bloco {bloco}, apto {apto} — o arquiteto/engenheiro responsável poderá conferir este registro.
      </p>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
        <button className="btn btn-primary" onClick={onNovoLancamento}>Novo lançamento</button>
        <button className="btn btn-ghost" onClick={onVoltarInicio}>Voltar ao início</button>
      </div>
    </div>
  );
}
