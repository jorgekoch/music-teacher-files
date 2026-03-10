import type { Profile } from "../types";
import { UserMenu } from "./UserMenu";
import { SupportWidget } from "./SupportWidget";
import { BrandLogo } from "./BrandLogo";

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
        <div className="topbar-brand">
          <BrandLogo variant="dashboard" />
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