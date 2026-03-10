import type { Profile } from "../types";
import { UserMenu } from "./UserMenu";
import { SupportWidget } from "./SupportWidget";

type Props = {
  children: React.ReactNode;
  profile: Profile | null;
  onProfileClick: () => void;
  onLogout: () => void;
};

export function Layout({ children, profile, onProfileClick, onLogout }: Props) {
  return (
    <div className="app-shell">
      <header className="topbar app-topbar">
        <div className="topbar-texts">
          <p className="eyebrow">Arquivapp</p>
          <h1 className="brand">Arquivapp</h1>
          <p className="subtitle mobile-friendly-subtitle">
            {profile
              ? `Bem-vindo, ${profile.name}`
              : "Carregando seu espaço de arquivos..."}
          </p>
        </div>

        <UserMenu
          profile={profile}
          onProfileClick={onProfileClick}
          onLogout={onLogout}
        />
      </header>

      <main className="main-content">{children}</main>

      <SupportWidget />
    </div>
  );
}