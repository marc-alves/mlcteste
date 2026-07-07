import { HelmetIcon, RulerIcon } from "../icons";

type Props = {
  onSelectTerceiro: () => void;
  onSelectFiscal: () => void;
};

export function Home({ onSelectTerceiro, onSelectFiscal }: Props) {
  return (
    <>
      <div className="eyebrow">Selecione seu perfil</div>
      <h1 className="screen-title">Quem está acessando?</h1>
      <p className="screen-sub">Escolha como você participa da obra para abrirmos o fluxo certo.</p>
      <button className="role-card" onClick={onSelectTerceiro}>
        <div className="role-icon">
          <HelmetIcon />
        </div>
        <div className="role-copy">
          <strong>Sou Terceiro</strong>
          <span>Empresa prestadora de serviço (gesso, pintura). Registrar o que foi executado.</span>
        </div>
      </button>
      <button className="role-card" onClick={onSelectFiscal}>
        <div className="role-icon">
          <RulerIcon />
        </div>
        <div className="role-copy">
          <strong>Sou Arquiteto / Engenheiro</strong>
          <span>Conferir os lançamentos das empresas e acompanhar a evolução da obra.</span>
        </div>
      </button>
    </>
  );
}
