import { useEffect, useState } from "react";
import type { Profile } from "../types";
import { UserAvatar } from "./UserAvatar";
import { useTheme } from "../hooks/useTheme";
import {
  createCustomerPortalSession,
  createProCheckoutSession,
} from "../services/billingService";

type Props = {
  open: boolean;
  profile: Profile | null;
  onClose: () => void;
  onUpdateProfile: (name: string) => Promise<void>;
  onUpdatePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
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
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [loadingPortal, setLoadingPortal] = useState(false);

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

  function formatBytes(bytes: number) {
    if (!Number.isFinite(bytes) || bytes < 0) {
      return "0 MB";
    }

    const mb = bytes / 1024 / 1024;
    const gb = bytes / 1024 / 1024 / 1024;

    if (gb >= 1) {
      return `${gb.toFixed(2)} GB`;
    }

    return `${mb.toFixed(1)} MB`;
  }

  const storageUsed =
    typeof profile.storageUsed === "number" ? profile.storageUsed : 0;

  const storageLimit =
    typeof profile.storageLimit === "number" ? profile.storageLimit : 0;

  const storagePercentage = storageLimit
    ? Math.min((storageUsed / storageLimit) * 100, 100)
    : 0;

  const storageRemaining = Math.max(storageLimit - storageUsed, 0);
  const planLabel = profile.plan || "FREE";
  const isFreePlan = planLabel === "FREE";
  const isNearLimit = storagePercentage >= 80;
  const isCriticalLimit = storagePercentage >= 95;

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

  async function handleUpgradeToPro() {
    try {
      setLoadingCheckout(true);
      const checkoutUrl = await createProCheckoutSession();
      window.location.href = checkoutUrl;
    } finally {
      setLoadingCheckout(false);
    }
  }

  async function handleManageSubscription() {
    try {
      setLoadingPortal(true);
      const portalUrl = await createCustomerPortalSession();
      window.location.href = portalUrl;
    } finally {
      setLoadingPortal(false);
    }
  }

  function handleOverlayClick() {
    onClose();
  }

  function handleDialogClick(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
  }

  function getStorageAlert() {
    if (!isFreePlan) return null;

    if (isCriticalLimit) {
      return {
        title: "Seu armazenamento está praticamente cheio",
        description:
          "Você está muito perto do limite do plano FREE de 500 MB. O plano PRO inclui 20 GB e recursos avançados.",
        className: "profile-storage-alert profile-storage-alert--critical",
      };
    }

    if (isNearLimit) {
      return {
        title: "Seu armazenamento está quase cheio",
        description:
          "Você já usou boa parte do seu espaço no plano FREE de 500 MB. O plano PRO inclui 20 GB e recursos avançados.",
        className: "profile-storage-alert profile-storage-alert--warning",
      };
    }

    return null;
  }

  const storageAlert = getStorageAlert();

  return (
    <div className="dialog-overlay" onClick={handleOverlayClick}>
      <div
        className="dialog-card profile-dialog-card scrollable-dialog"
        onClick={handleDialogClick}
      >
        <h3>Perfil</h3>
        <p className="muted">Gerencie suas informações pessoais.</p>

        <div className="profile-header-block">
          <UserAvatar
            name={profile.name}
            avatarUrl={profile.avatarUrl}
            size={72}
          />

          <div className="profile-avatar-actions">
            <label className="ghost-button avatar-upload-button">
              {loadingAvatar ? "Enviando..." : "Alterar foto"}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleAvatarChange}
              />
            </label>
          </div>
        </div>

        <div className="profile-storage-card">
          <div className="profile-storage-card__header">
            <div>
              <h4>Armazenamento</h4>
              <p className="muted">Acompanhe o uso do seu plano atual.</p>
            </div>

            <span
              className={`profile-plan-badge ${
                isFreePlan
                  ? "profile-plan-badge--free"
                  : "profile-plan-badge--pro"
              }`}
            >
              {planLabel}
            </span>
          </div>

          <div className="profile-storage-card__summary">
            <div className="profile-storage-card__numbers">
              <strong>{formatBytes(storageUsed)}</strong>
              <span className="muted">usados</span>
            </div>

            <div className="profile-storage-card__numbers">
              <strong>{formatBytes(storageRemaining)}</strong>
              <span className="muted">disponíveis</span>
            </div>

            <div className="profile-storage-card__numbers">
              <strong>{Math.round(storagePercentage)}%</strong>
              <span className="muted">do plano</span>
            </div>
          </div>

          <div className="storage-bar profile-storage-card__bar">
            <div
              className={`storage-fill ${
                isCriticalLimit
                  ? "storage-fill-critical"
                  : isNearLimit
                  ? "storage-fill-warning"
                  : ""
              }`}
              style={{ width: `${storagePercentage}%` }}
            />
          </div>

          <p className="muted profile-storage-card__usage-text">
            {formatBytes(storageUsed)} de {formatBytes(storageLimit)} utilizados
          </p>

          {storageAlert && (
            <div className={storageAlert.className}>
              <strong>{storageAlert.title}</strong>
              <p>{storageAlert.description}</p>
            </div>
          )}

          {isFreePlan ? (
            <div className="profile-upgrade-callout">
              <div>
                <strong>Precisa de mais espaço e recursos?</strong>
                <p className="muted">
                  O plano PRO inclui <strong>20 GB</strong> de armazenamento,
                  compartilhamento por link e arquivos maiores.
                </p>
              </div>

              <button
                type="button"
                className="ghost-button small"
                onClick={handleUpgradeToPro}
                disabled={loadingCheckout}
              >
                {loadingCheckout ? "Redirecionando..." : "Assinar PRO"}
              </button>
            </div>
          ) : (
            <div className="profile-upgrade-callout">
              <div>
                <strong>Plano PRO ativo</strong>
                <p className="muted">
                  Gerencie cobrança, forma de pagamento e assinatura no portal do
                  cliente.
                </p>
              </div>

              <button
                type="button"
                className="ghost-button small"
                onClick={handleManageSubscription}
                disabled={loadingPortal}
              >
                {loadingPortal ? "Abrindo..." : "Gerenciar assinatura"}
              </button>
            </div>
          )}
        </div>

        <hr className="profile-divider" />

        <form className="auth-form" onSubmit={handleProfileSubmit}>
          <input
            className="input"
            type="text"
            placeholder="Nome de usuário"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button
            className="primary-button"
            type="submit"
            disabled={loadingProfile}
          >
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
              className={`theme-option ${
                theme === "light" ? "active-theme-option" : ""
              }`}
              onClick={() => setTheme("light")}
            >
              Claro
            </button>

            <button
              type="button"
              className={`theme-option ${
                theme === "dark" ? "active-theme-option" : ""
              }`}
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

          <button
            className="primary-button"
            type="submit"
            disabled={loadingPassword}
          >
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