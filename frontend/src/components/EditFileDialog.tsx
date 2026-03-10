import { useEffect, useState } from "react";
import type { FileItem } from "../types";

type Props = {
  open: boolean;
  file: FileItem | null;
  onCancel: () => void;
  onConfirm: (name: string) => Promise<void>;
};

export function EditFileDialog({ open, file, onCancel, onConfirm }: Props) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (file) {
      setName(file.name);
    }
  }, [file]);

  if (!open || !file) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);
      await onConfirm(name);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dialog-overlay" onClick={onCancel}>
      <div className="dialog-card" onClick={(e) => e.stopPropagation()}>
        <h3>Renomear arquivo</h3>
        <p className="muted">Defina um novo nome para o arquivo.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            className="input"
            type="text"
            placeholder="Nome do arquivo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="dialog-actions">
            <button
              type="button"
              className="ghost-button"
              onClick={onCancel}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}