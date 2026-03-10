import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../services/api";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function WaitlistDialog({ open, onClose }: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

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

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/waitlist", {
        ...form,
        interest: "PRO",
      });

      toast.success("Perfeito! Seu contato foi salvo.");
      setForm({ name: "", email: "" });
      onClose();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.error || "Não foi possível salvar seu contato."
      );
    } finally {
      setLoading(false);
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
        className="dialog-card waitlist-dialog-card"
        onClick={handleDialogClick}
      >
        <p className="eyebrow">Plano PRO</p>
        <h3 className="waitlist-title">Entre na lista de interesse</h3>

        <p className="muted waitlist-description">
          O plano PRO terá mais armazenamento e recursos extras.
          <br />
          <strong>Preço previsto: R$19,90/mês.</strong>
        </p>

        <div className="waitlist-benefits">
          <div className="waitlist-benefit">
            <span className="waitlist-benefit__icon">💾</span>
            <div>
              <strong>Mais armazenamento</strong>
              <p className="muted">Ideal para quem precisa guardar mais arquivos.</p>
            </div>
          </div>

          <div className="waitlist-benefit">
            <span className="waitlist-benefit__icon">⚡</span>
            <div>
              <strong>Recursos extras</strong>
              <p className="muted">
                Tenha acesso às próximas melhorias do Arquivapp.
              </p>
            </div>
          </div>

          <div className="waitlist-benefit">
            <span className="waitlist-benefit__icon">📩</span>
            <div>
              <strong>Aviso quando estiver disponível</strong>
              <p className="muted">
                Entraremos em contato quando o plano PRO for liberado.
              </p>
            </div>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            className="input"
            type="text"
            placeholder="Seu nome (opcional)"
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name: e.target.value }))
            }
          />

          <input
            className="input"
            type="email"
            placeholder="Seu melhor e-mail"
            value={form.email}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, email: e.target.value }))
            }
            required
          />

          <button className="primary-button full-width" disabled={loading}>
            {loading ? "Salvando..." : "Entrar na lista"}
          </button>
        </form>

        <p className="muted waitlist-footnote">
          Sem compromisso. Apenas vamos avisar quando houver novidades sobre o
          plano PRO.
        </p>

        <div className="dialog-actions">
          <button className="ghost-button" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}