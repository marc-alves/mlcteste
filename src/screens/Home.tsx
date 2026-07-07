import { IMG } from "../images";

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
      <div className="test-banner">
        Versão de teste — os dados e fotos aqui são fictícios, só para demonstrar como o app vai funcionar.
      </div>
      <button className="role-card" onClick={onSelectTerceiro}>
        <div className="role-icon">
          <img src={IMG.emojiPedreiro} alt="Pedreiro" />
        </div>
        <div className="role-copy">
          <strong>Sou Terceiro (pedreiro, gesseiro, pintor...)</strong>
          <span>Trabalho para uma empresa prestadora de serviço (gesso, pintura) e quero registrar com fotos o que já foi feito na obra.</span>
        </div>
      </button>
      <button className="role-card" onClick={onSelectFiscal}>
        <div className="role-icon">
          <img src={IMG.emojiArquiteta} alt="Arquiteta ou engenheiro" />
        </div>
        <div className="role-copy">
          <strong>Sou Arquiteto(a) / Engenheiro(a)</strong>
          <span>Quero conferir o que as empresas registraram, aprovar o serviço ou apontar uma pendência.</span>
        </div>
      </button>
    </>
  );
}
