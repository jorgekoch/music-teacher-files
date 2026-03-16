import { useState } from "react";
import toast from "react-hot-toast";

type Props = {
  open: boolean;
  onClose: () => void;
  onUpgrade: () => void;
};

const COUPON_CODE = "OBRIGADO25";

export function UpgradeOfferDialog({
  open,
  onClose,
  onUpgrade,
}: Props) {
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  async function handleCopyCoupon() {
    try {
      await navigator.clipboard.writeText(COUPON_CODE);
      setCopied(true);
      toast.success("Cupom copiado.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Não foi possível copiar o cupom.");
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
        className="dialog-card upgrade-offer-dialog"
        onClick={handleDialogClick}
      >
        <div className="upgrade-offer-dialog__badge">
          Oferta especial
        </div>

        <h3>Desbloqueie o Arquivapp PRO com desconto</h3>

        <p className="muted">
          Como agradecimento por usar o Arquivapp, você ganhou
          <strong> 25% de desconto</strong> no plano PRO.
        </p>

        <div className="upgrade-offer-dialog__coupon-box">
          <span className="upgrade-offer-dialog__coupon-label">Cupom</span>
          <strong>{COUPON_CODE}</strong>
        </div>

        <p className="upgrade-offer-dialog__note">
          Válido até o final desta semana.
        </p>

        <div className="upgrade-offer-dialog__features">
          <span>✔ Mais armazenamento</span>
          <span>✔ Compartilhamento avançado</span>
          <span>✔ Recursos exclusivos PRO</span>
        </div>

        <div className="dialog-actions">
          <button
            type="button"
            className={`ghost-button ${
              copied ? "upgrade-offer-dialog__copy-success" : ""
            }`}
            onClick={handleCopyCoupon}
          >
            {copied ? "Copiado!" : "Copiar cupom"}
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={onUpgrade}
          >
            Atualizar para PRO
          </button>
        </div>

        <div className="dialog-actions">
          <button type="button" className="ghost-button" onClick={onClose}>
            Agora não
          </button>
        </div>
      </div>
    </div>
  );
}