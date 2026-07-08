import { useState } from "react";
import { EMPRESAS, FEED_MOCK, STATUS_LABEL, type Lancamento } from "../data";
import { CameraIcon, CheckIcon, EmptyIcon } from "../icons";
import { BLOCO_IMAGENS, IMG } from "../images";
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
        <img className="empresa-thumb" src={e.imagem} alt={e.nome} />
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

type TerceiroHomeProps = StepProps & {
  lancamentos: Lancamento[];
  onAbrirRegistro: (id: string) => void;
};

export function TerceiroHome({ novo, lancamentos, onNext, onAbrirRegistro }: TerceiroHomeProps) {
  if (!novo.empresaKey) return null;
  const emp = EMPRESAS[novo.empresaKey];
  const meus = lancamentos
    .filter((l) => l.empresaKey === novo.empresaKey && l.terceiroNome === novo.nome)
    .sort((a, b) => b.id.localeCompare(a.id));
  const validados = meus.filter((l) => l.status === "conferido").length;
  const feed = FEED_MOCK[novo.empresaKey] ?? [];
  const entreguesEquipe = lancamentos.filter((l) => l.empresaKey === novo.empresaKey).length;
  const pctMeta = Math.min(100, Math.round((entreguesEquipe / emp.metaMensalComodos) * 100));

  return (
    <>
      <div className="eyebrow">Olá, {novo.nome.split(" ")[0]}</div>
      <h1 className="screen-title">{emp.nome}</h1>
      <p className="screen-sub">Seu histórico nesta empresa e o que a equipe já lançou na obra.</p>

      <div className="area-block">
      <h2 className="area-title">Você</h2>

      <div className="kpi-row">
        <div className="kpi-card">
          <span className="kpi-value">{meus.length}</span>
          <span className="kpi-label">seus lançamentos</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-value">{validados}</span>
          <span className="kpi-label">validados pelo arquiteto</span>
        </div>
      </div>

      <div className="section-label">Seus registros</div>
      {meus.length === 0 ? (
        <div className="empty-state">
          <EmptyIcon />
          <div>Você ainda não lançou nenhum serviço aqui.</div>
        </div>
      ) : (
        meus.map((l) => {
          const serv = emp.servicos[l.servicoKey];
          return (
            <div key={l.id} className={`reg-card reg-card-${l.status}`} onClick={() => onAbrirRegistro(l.id)}>
              <div className="reg-top">
                <div style={{ flex: 1 }}>
                  <div className="reg-local">Bloco {l.bloco} · Apto {l.apto}</div>
                  <div className="reg-meta">{serv.nome}</div>
                </div>
                <span className={`stamp ${l.status}`}>{STATUS_LABEL[l.status]}</span>
              </div>
              <div className="reg-data">{l.data}</div>
            </div>
          );
        })
      )}
      </div>

      <div className="area-divider" />

      <div className="area-block">
      <h2 className="area-title">Equipe</h2>

      <div className="section-label">Meta do mês</div>
      <div className="progress-item">
        <div className="progress-item-head">
          <span className="progress-item-label">Cômodos entregues</span>
          <span className="progress-item-frac">{entreguesEquipe}/{emp.metaMensalComodos}</span>
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${pctMeta}%` }} />
        </div>
      </div>

      <div className="section-label">O que a equipe já lançou</div>
      {feed.map((f, i) => (
        <div key={i} className="feed-card">
          <img className="feed-thumb" src={f.foto} alt={f.servico} />
          <div className="feed-body">
            <div className="feed-title"><strong>{f.autor}</strong> lançou — {f.servico}</div>
            <div className="feed-meta">Bloco {f.bloco} · Apto {f.apto}</div>
            <div className="feed-tempo">{f.tempo}</div>
          </div>
        </div>
      ))}
      </div>

      <div className="bottombar">
        <button className="btn btn-primary" onClick={onNext}>Novo lançamento</button>
      </div>
    </>
  );
}

type TerceiroRegistroProps = { lancamento: Lancamento };

export function TerceiroRegistro({ lancamento: l }: TerceiroRegistroProps) {
  const emp = EMPRESAS[l.empresaKey];
  const serv = emp.servicos[l.servicoKey];
  const blocoImg = BLOCO_IMAGENS[l.bloco];

  return (
    <>
      {blocoImg && <img className="bloco-banner" src={blocoImg} alt={`Bloco ${l.bloco}`} />}
      <div className="detail-header">
        <div className="reg-top" style={{ marginBottom: 0 }}>
          <div>
            <div className="reg-local">Bloco {l.bloco} · Apto {l.apto}</div>
            <div className="reg-meta">{emp.nome} — {serv.nome}</div>
            <div className="reg-meta">{l.data}</div>
          </div>
          <span className={`stamp ${l.status}`}>{STATUS_LABEL[l.status]}</span>
        </div>
      </div>

      <div className="obs-box" style={l.status === "conferido" ? { color: "var(--primary-dark)" } : undefined}>
        {l.status === "conferido" && "Validado pelo arquiteto."}
        {l.status === "pendente" && "Falta o arquiteto validar este lançamento."}
        {l.status === "pendencia" && "O arquiteto apontou um impedimento neste lançamento — veja a nota abaixo."}
      </div>

      {l.notaFiscal && (
        <>
          <div className="section-label">Nota do arquiteto</div>
          <div className="obs-box">{l.notaFiscal}</div>
        </>
      )}

      <div className="section-label">Pontos de verificação</div>
      {l.pontos.map((p) => (
        <div key={p.nome} className="pt-item pt-item-foto">
          <div className="pt-item-head">
            <span className="pt-name">{p.nome}</span>
            {p.foto ? (
              <span className="pt-status-ok"><CheckIcon /> foto anexada</span>
            ) : (
              <span className="pt-status-off">sem foto</span>
            )}
          </div>
          {p.foto && <img className="pt-thumb" src={p.foto} alt={p.nome} />}
        </div>
      ))}

      {l.observacao && (
        <>
          <div className="section-label">Sua observação</div>
          <div className="obs-box">{l.observacao}</div>
        </>
      )}
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
  const blocoImg = BLOCO_IMAGENS[bloco.trim().toUpperCase()];
  return (
    <>
      <div className="eyebrow">Passo 3 de 5</div>
      <h1 className="screen-title">Onde foi o serviço?</h1>
      <p className="screen-sub">Informe o bloco e o apartamento em que o serviço foi executado.</p>
      {blocoImg && <img className="bloco-banner" src={blocoImg} alt={`Bloco ${bloco}`} />}
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
    if (!files || !files[0]) return;
    const url = URL.createObjectURL(files[0]);
    const pontos = novo.pontos.map((p, idx) => (idx === i ? { ...p, foto: url } : p));
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
      <p className="screen-sub">Tire ou anexe uma foto para cada ponto do serviço "{servico.nome}" — é o que o arquiteto/engenheiro vai conferir.</p>
      {novo.pontos.map((p, i) => (
        <div key={p.nome} className="ponto-card">
          <div className="ponto-head">
            <strong>{p.nome}</strong>
            {p.foto && <span className="pt-status-ok"><CheckIcon /> foto salva</span>}
          </div>
          {p.foto && <img className="pt-thumb" src={p.foto} alt={p.nome} style={{ marginBottom: 10 }} />}
          <label className={`foto-btn ${p.foto ? "ok" : ""}`} htmlFor={`file${i}`}>
            <CameraIcon /> {p.foto ? "Trocar foto" : "Anexar foto deste ponto"}
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
  const blocoImg = BLOCO_IMAGENS[novo.bloco.trim().toUpperCase()];
  const semFoto = novo.pontos.some((p) => !p.foto);
  return (
    <>
      <div className="eyebrow">Confirmar antes de enviar</div>
      <h1 className="screen-title">Revisão do lançamento</h1>
      <p className="screen-sub">Confira se está tudo certo — depois de enviado, o arquiteto/engenheiro vai ver este registro.</p>
      {blocoImg && <img className="bloco-banner" src={blocoImg} alt={`Bloco ${novo.bloco}`} />}
      <div className="detail-header">
        <div className="reg-local">Bloco {novo.bloco} · Apto {novo.apto}</div>
        <div className="reg-meta">{emp.nome} — {serv.nome}</div>
        <div className="reg-meta">Lançado por {novo.nome}</div>
      </div>
      <div className="section-label">Pontos de verificação</div>
      {novo.pontos.map((p) => (
        <div key={p.nome} className="pt-item pt-item-foto">
          <div className="pt-item-head">
            <span className="pt-name">{p.nome}</span>
            {p.foto ? (
              <span className="pt-status-ok"><CheckIcon /> foto anexada</span>
            ) : (
              <span className="pt-status-off">sem foto</span>
            )}
          </div>
          {p.foto && <img className="pt-thumb" src={p.foto} alt={p.nome} />}
        </div>
      ))}
      {semFoto && (
        <div className="obs-box" style={{ background: "var(--danger-soft)", color: "var(--danger)" }}>
          Atenção: ainda há pontos sem foto. Você pode enviar assim mesmo, mas o fiscal pode pedir para completar depois.
        </div>
      )}
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
      <img className="success-emoji" src={IMG.emojiPedreiro} alt="Enviado" />
      <div className="success-stamp"><span>ENVIADO</span></div>
      <h1 className="screen-title">Lançamento registrado!</h1>
      <p className="screen-sub">
        Bloco {bloco}, apto {apto} — recebemos suas fotos e o arquiteto/engenheiro responsável já pode conferir este registro.
      </p>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
        <button className="btn btn-primary" onClick={onNovoLancamento}>Novo lançamento</button>
        <button className="btn btn-ghost" onClick={onVoltarInicio}>Voltar ao início</button>
      </div>
    </div>
  );
}
