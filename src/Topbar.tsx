import { BackIcon, MoonIcon, SunIcon } from "./icons";
import { SCREEN_LABELS, type Screen } from "./types";

type Props = {
  screen: Screen;
  darkMode: boolean;
  onBack: () => void;
  onToggleTheme: () => void;
};

export function Topbar({ screen, darkMode, onBack, onToggleTheme }: Props) {
  const showBack = screen !== "home";
  return (
    <div className="topbar">
      {showBack ? (
        <button className="back-btn" onClick={onBack}>
          <BackIcon />
        </button>
      ) : (
        <div className="mark">
          <span>M</span>
        </div>
      )}
      {!showBack && (
        <div className="title-block">
          <span className="app-name">MLC Controle</span>
          <span className="app-tag">Registro de obra</span>
        </div>
      )}
      {showBack && <span className="screen-label">{SCREEN_LABELS[screen]}</span>}
      <button className="theme-btn" onClick={onToggleTheme}>
        {darkMode ? <SunIcon /> : <MoonIcon />}
      </button>
    </div>
  );
}
