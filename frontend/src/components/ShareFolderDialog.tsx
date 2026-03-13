import { useEffect, useState } from "react";
import type { Folder } from "../types";

type SharedPerson = {
  id: number;
  email: string;
  role: "viewer" | "editor";
};

type Props = {
  open: boolean;
  folder: Folder | null;
  sharedPeople?: SharedPerson[];
  onClose: () => void;
  onInvite: (folderId: number, email: string) => Promise<void> | void;
  onRemoveAccess: (shareId: number) => Promise<void> | void;
};

export function ShareFolderDialog({
  open,
  folder,
  sharedPeople = [],
  onClose,
  onInvite,
  onRemoveAccess,
}: Props) {
  const [email, setEmail] = useState("");
  const [loadingInvite, setLoadingInvite] = useState(false);
  const [removingShareId, setRemovingShareId] = useState<number | null>(null);

  useEffect(() => {
    if (!open) {
      setEmail("");
      setRemovingShareId(null);
    }
  }, [open]);

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

  if (!open || !folder) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;

    try {
      setLoadingInvite(true);
      if (!folder) return;
      await onInvite(folder.id, trimmedEmail);
      setEmail("");
    } finally {
      setLoadingInvite(false);
    }
  }

  async function handleRemoveAccess(shareId: number) {
    try {
      setRemovingShareId(shareId);
      await onRemoveAccess(shareId);
    } finally {
      setRemovingShareId(null);
    }
  }

  function handleOverlayClick() {
    onClose();
  }

  function handleDialogClick(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
  }

  function getRoleLabel(role: SharedPerson["role"]) {
    if (role === "editor") return "Editor";
    return "Visualizador";
  }

  return (
    <div className="dialog-overlay" onClick={handleOverlayClick}>
      <div
        className="dialog-card share-folder-dialog-card"
        onClick={handleDialogClick}
      >
        <div className="share-folder-dialog__header">
          <div>
            <h3>Compartilhar pasta</h3>
            <p className="muted">
              Convide pessoas para acessar a pasta{" "}
              <strong>{folder.name}</strong>.
            </p>
          </div>

          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Fechar compartilhamento"
          >
            ✕
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            className="input"
            type="email"
            placeholder="Digite o e-mail da pessoa"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            type="submit"
            className="primary-button"
            disabled={loadingInvite}
          >
            {loadingInvite ? "Convidando..." : "Convidar"}
          </button>
        </form>

        <div className="share-folder-dialog__list">
          <div className="share-folder-dialog__section-header">
            <h4>Pessoas com acesso</h4>
            <p className="muted">
              Gerencie quem pode visualizar esta pasta.
            </p>
          </div>

          {sharedPeople.length === 0 ? (
            <div className="share-folder-empty-state">
              <span className="share-folder-empty-state__emoji">👥</span>
              <p className="muted">
                Ainda não há pessoas com acesso a esta pasta.
              </p>
            </div>
          ) : (
            <div className="share-folder-people-list">
              {sharedPeople.map((person) => (
                <div key={person.id} className="share-folder-person-item">
                  <div className="share-folder-person-item__info">
                    <strong>{person.email}</strong>
                    <span className="muted">{getRoleLabel(person.role)}</span>
                  </div>

                  <div className="share-folder-person-item__actions">
                    <span className="share-folder-person-item__badge">
                      {getRoleLabel(person.role)}
                    </span>

                    <button
                      type="button"
                      className="danger-button small"
                      onClick={() => handleRemoveAccess(person.id)}
                      disabled={removingShareId === person.id}
                    >
                      {removingShareId === person.id
                        ? "Removendo..."
                        : "Remover"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dialog-actions">
          <button type="button" className="ghost-button" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}