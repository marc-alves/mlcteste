import { useEffect, useState } from "react";
import { Topbar } from "./Topbar";
import { Home } from "./screens/Home";
import {
  TerceiroNome,
  TerceiroEmpresa,
  TerceiroLocal,
  TerceiroServico,
  TerceiroPontos,
  TerceiroRevisao,
  TerceiroSucesso,
} from "./screens/Terceiro";
import { FiscalNome, FiscalEmpresas, FiscalLista, FiscalDetalhe } from "./screens/Fiscal";
import { LANCAMENTOS_INICIAIS, criarEvento, type Evento, type Lancamento, type Status } from "./data";
import { BACK_FLOW, NOVO_LANCAMENTO_VAZIO, type Screen, type NovoLancamentoState } from "./types";

let seq = 6;

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);
  const [lancamentos, setLancamentos] = useState<Lancamento[]>(LANCAMENTOS_INICIAIS);

  const [novo, setNovoState] = useState<NovoLancamentoState>(NOVO_LANCAMENTO_VAZIO);
  const setNovo = (update: Partial<NovoLancamentoState>) => setNovoState((s) => ({ ...s, ...update }));

  const [fiscalNome, setFiscalNome] = useState("");
  const [filtroEmpresa, setFiltroEmpresa] = useState<string | null>(null);
  const [filtroStatus, setFiltroStatus] = useState<"todos" | Status>("todos");
  const [currentId, setCurrentId] = useState<string | null>(null);

  const go = (s: Screen) => {
    setScreen(s);
    window.scrollTo(0, 0);
  };

  const handleBack = () => go(BACK_FLOW[screen] ?? "home");

  const resetTudo = () => {
    setScreen("home");
    setNovoState(NOVO_LANCAMENTO_VAZIO);
    setFiscalNome("");
    setFiltroEmpresa(null);
    setFiltroStatus("todos");
    setCurrentId(null);
  };

  const enviarLancamento = () => {
    const jaExisteServico = lancamentos.some(
      (l) => l.bloco === novo.bloco && l.apto === novo.apto && l.servicoKey === novo.servicoKey && l.empresaKey === novo.empresaKey
    );
    const evento = jaExisteServico
      ? criarEvento(novo.nome, "subiu novas fotos")
      : criarEvento(novo.nome, "criou o lançamento");

    const novoRegistro: Lancamento = {
      id: "L" + seq++,
      empresaKey: novo.empresaKey!,
      servicoKey: novo.servicoKey,
      bloco: novo.bloco,
      apto: novo.apto,
      terceiroNome: novo.nome,
      data: new Date().toLocaleDateString("pt-BR"),
      pontos: novo.pontos.map((p) => ({ ...p })),
      observacao: novo.observacao,
      status: "pendente",
      notaFiscal: "",
      eventos: [evento],
    };
    setLancamentos((ls) => [novoRegistro, ...ls]);
    go("terceiro-sucesso");
  };

  const currentLancamento = currentId ? lancamentos.find((l) => l.id === currentId) ?? null : null;

  const updateLancamento = (id: string, update: Partial<Lancamento>, evento?: Evento) => {
    setLancamentos((ls) =>
      ls.map((l) => (l.id === id ? { ...l, ...update, eventos: evento ? [...l.eventos, evento] : l.eventos } : l))
    );
  };

  return (
    <div id="phone">
      <Topbar screen={screen} darkMode={darkMode} onBack={handleBack} onToggleTheme={() => setDarkMode((d) => !d)} />
      <div id="content">
        {screen === "home" && (
          <Home onSelectTerceiro={() => go("terceiro-nome")} onSelectFiscal={() => go("fiscal-nome")} />
        )}

        {screen === "terceiro-nome" && (
          <TerceiroNome novo={novo} setNovo={setNovo} onNext={() => go("terceiro-empresa")} />
        )}
        {screen === "terceiro-empresa" && (
          <TerceiroEmpresa novo={novo} setNovo={setNovo} onNext={() => go("terceiro-local")} />
        )}
        {screen === "terceiro-local" && (
          <TerceiroLocal novo={novo} setNovo={setNovo} onNext={() => go("terceiro-servico")} />
        )}
        {screen === "terceiro-servico" && (
          <TerceiroServico novo={novo} setNovo={setNovo} onNext={() => go("terceiro-pontos")} />
        )}
        {screen === "terceiro-pontos" && (
          <TerceiroPontos novo={novo} setNovo={setNovo} onNext={() => go("terceiro-revisao")} />
        )}
        {screen === "terceiro-revisao" && (
          <TerceiroRevisao novo={novo} setNovo={setNovo} onNext={enviarLancamento} />
        )}
        {screen === "terceiro-sucesso" && (
          <TerceiroSucesso
            bloco={novo.bloco}
            apto={novo.apto}
            onNovoLancamento={() => {
              setNovo({ bloco: "", apto: "", servicoKey: "", pontos: [], observacao: "" });
              go("terceiro-empresa");
            }}
            onVoltarInicio={resetTudo}
          />
        )}

        {screen === "fiscal-nome" && (
          <FiscalNome
            fiscalNome={fiscalNome}
            onConfirm={(nome) => {
              setFiscalNome(nome);
              go("fiscal-empresas");
            }}
          />
        )}
        {screen === "fiscal-empresas" && (
          <FiscalEmpresas
            fiscalNome={fiscalNome}
            lancamentos={lancamentos}
            onAbrirEmpresa={(key) => {
              setFiltroEmpresa(key);
              setFiltroStatus("todos");
              go("fiscal-lista");
            }}
          />
        )}
        {screen === "fiscal-lista" && filtroEmpresa && (
          <FiscalLista
            empresaKey={filtroEmpresa}
            lancamentos={lancamentos}
            filtroStatus={filtroStatus}
            onFiltroChange={setFiltroStatus}
            onAbrirDetalhe={(id) => {
              setCurrentId(id);
              go("fiscal-detalhe");
            }}
          />
        )}
        {screen === "fiscal-detalhe" && currentLancamento && (
          <FiscalDetalhe
            lancamento={currentLancamento}
            todos={lancamentos}
            onMarcarConferido={(nota) => {
              updateLancamento(currentLancamento.id, { notaFiscal: nota, status: "conferido" }, criarEvento(fiscalNome, "conferiu o lançamento"));
            }}
            onRegistrarPendencia={(nota) => {
              updateLancamento(currentLancamento.id, { notaFiscal: nota, status: "pendencia" }, criarEvento(fiscalNome, "conferiu e registrou pendência"));
            }}
            onReabrirConferencia={() => {
              updateLancamento(currentLancamento.id, { status: "pendente" }, criarEvento(fiscalNome, "reabriu a conferência"));
            }}
          />
        )}
      </div>
    </div>
  );
}
