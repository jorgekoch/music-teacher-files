import { useEffect, useState } from "react";
import type { Profile } from "../types";
import { UserAvatar } from "./UserAvatar";
import { useTheme } from "../hooks/useTheme";

type Props = {
  open: boolean;
  profile: Profile | null;
  onClose: () => void;
  onUpdateProfile: (name: string) => Promise<void>;
  onUpdatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  onUpdateAvatar: (file: File) => Promise<void>;
};

export function ProfileDialog({
  open,
  profile,
  onClose,
  onUpdateProfile,
  onUpdatePassword,
  onUpdateAvatar,
}: Props) {
  const { theme, setTheme } = useTheme();

  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [loadingAvatar, setLoadingAvatar] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name);
    }
  }, [profile]);

  useEffect(() => {
    if (!open) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open || !profile) return null;

  async function handleProfileSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoadingProfile(true);
      await onUpdateProfile(name.trim());
    } finally {
      setLoadingProfile(false);
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoadingPassword(true);
      await onUpdatePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
    } finally {
      setLoadingPassword(false);
    }
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoadingAvatar(true);
      await onUpdateAvatar(file);
      e.target.value = "";
    } finally {
      setLoadingAvatar(false);
    }
  }

  function handleOverlayClick() {
    onClose();
  }

  function handleDialogClick(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
  }

  return (
    <div className="dialog-overlay" onClick={handleOverlayClick}>
      <div
        className="dialog-card profile-dialog-card scrollable-dialog"
        onClick={handleDialogClick}
      >
        <h3>Perfil</h3>
        <p className="muted">Gerencie suas informações pessoais.</p>

        <div className="profile-header-block">
          <UserAvatar name={profile.name} avatarUrl={profile.avatarUrl} size={72} />

          <div className="profile-avatar-actions">
            <label className="ghost-button avatar-upload-button">
              {loadingAvatar ? "Enviando..." : "Alterar foto"}
              <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
            </label>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleProfileSubmit}>
          <input
            className="input"
            type="text"
            placeholder="Nome de usuário"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button className="primary-button" type="submit" disabled={loadingProfile}>
            {loadingProfile ? "Salvando..." : "Salvar nome"}
          </button>
        </form>

        <hr className="profile-divider" />

        <div className="theme-section">
          <h4>Tema</h4>
          <p className="muted">Escolha a aparência do site.</p>

          <div className="theme-toggle-group">
            <button
              type="button"
              className={`theme-option ${theme === "light" ? "active-theme-option" : ""}`}
              onClick={() => setTheme("light")}
            >
              Claro
            </button>

            <button
              type="button"
              className={`theme-option ${theme === "dark" ? "active-theme-option" : ""}`}
              onClick={() => setTheme("dark")}
            >
              Escuro
            </button>
          </div>
        </div>

        <hr className="profile-divider" />

        <form className="auth-form" onSubmit={handlePasswordSubmit}>
          <input
            className="input"
            type="password"
            placeholder="Senha atual"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <input
            className="input"
            type="password"
            placeholder="Nova senha"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button className="primary-button" type="submit" disabled={loadingPassword}>
            {loadingPassword ? "Atualizando..." : "Alterar senha"}
          </button>
        </form>

        <div className="dialog-actions">
          <button className="ghost-button" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}