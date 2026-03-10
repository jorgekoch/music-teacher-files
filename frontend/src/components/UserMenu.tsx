import { Menu, UserCircle2, LogOut, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { UserAvatar } from "./UserAvatar";
import type { Profile } from "../types";

type Props = {
  profile: Profile | null;
  onProfileClick: () => void;
  onLogout: () => void;
};

export function UserMenu({ profile, onProfileClick, onLogout }: Props) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!wrapperRef.current) return;

      if (!wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function handleProfile() {
    setOpen(false);
    onProfileClick();
  }

  function handleLogout() {
    setOpen(false);
    onLogout();
  }

  return (
    <div className="user-menu-wrapper" ref={wrapperRef}>
      <button
        type="button"
        className={`user-menu-trigger ${open ? "user-menu-trigger-open" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Abrir menu do usuário"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <UserAvatar
          name={profile?.name}
          avatarUrl={profile?.avatarUrl}
          size={40}
        />

        <div className="user-menu-identity">
          <strong>{profile?.name || "Usuário"}</strong>
          <span>{profile?.email || "Conta"}</span>
        </div>

        <div className="user-menu-icons">
          <Menu size={16} />
          <ChevronDown
            size={16}
            className={`chevron-icon ${open ? "chevron-open" : ""}`}
          />
        </div>
      </button>

      <div className={`user-menu-dropdown ${open ? "dropdown-open" : ""}`}>
        <div className="user-menu-mobile-header">
          <UserAvatar
            name={profile?.name}
            avatarUrl={profile?.avatarUrl}
            size={42}
          />
          <div className="user-menu-mobile-identity">
            <strong>{profile?.name || "Usuário"}</strong>
            <span>{profile?.email || "Conta"}</span>
          </div>
        </div>

        <button className="user-menu-item" onClick={handleProfile}>
          <UserCircle2 size={16} />
          <span>Perfil</span>
        </button>

        <button className="user-menu-item danger-item" onClick={handleLogout}>
          <LogOut size={16} />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
}