import { X } from "lucide-react";
import type { FileItem } from "../types";

type Props = {
  open: boolean;
  file: FileItem | null;
  fileUrl: string | null;
  onClose: () => void;
};

function isPdf(url: string, name: string) {
  return url.toLowerCase().includes(".pdf") || name.toLowerCase().endsWith(".pdf");
}

function isImage(url: string, name: string) {
  const target = `${url} ${name}`.toLowerCase();
  return (
    target.includes(".png") ||
    target.includes(".jpg") ||
    target.includes(".jpeg") ||
    target.includes(".webp") ||
    target.includes(".gif")
  );
}

export function FilePreviewDialog({ open, file, fileUrl, onClose }: Props) {
  if (!open || !file || !fileUrl) return null;

  const showPdf = isPdf(fileUrl, file.name);
  const showImage = isImage(fileUrl, file.name);

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div
        className="dialog-card preview-dialog-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="preview-header">
          <div>
            <h3>{file.name}</h3>
            <p className="muted">Pré-visualização do arquivo</p>
          </div>

          <button className="icon-button" onClick={onClose} aria-label="Fechar preview">
            <X size={18} />
          </button>
        </div>

        <div className="preview-body">
          {showPdf ? (
            <iframe
              src={fileUrl}
              title={file.name}
              className="preview-frame"
            />
          ) : showImage ? (
            <img src={fileUrl} alt={file.name} className="preview-image" />
          ) : (
            <div className="empty-state">
              <div className="empty-state-emoji">📄</div>
              <h3>Preview indisponível</h3>
              <p className="muted">
                Esse tipo de arquivo não possui visualização embutida.
              </p>
              <a
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                className="primary-button preview-open-link"
              >
                Abrir em nova aba
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}