import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../services/api";

type SharedFileResponse = {
  token: string;
  name: string;
  size: number | null;
  createdAt: string;
  mimeType: string;
  fileUrl: string;
};

function formatFileSize(size: number | null) {
  if (!size && size !== 0) return "Tamanho não informado";

  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;

  return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function isPdf(mimeType: string, name: string) {
  return mimeType === "application/pdf" || name.toLowerCase().endsWith(".pdf");
}

function isImage(mimeType: string, name: string) {
  const target = `${mimeType} ${name}`.toLowerCase();

  return (
    target.includes("image/jpeg") ||
    target.includes("image/png") ||
    target.includes("image/webp") ||
    target.includes("image/gif") ||
    target.includes(".jpg") ||
    target.includes(".jpeg") ||
    target.includes(".png") ||
    target.includes(".webp") ||
    target.includes(".gif")
  );
}

export function SharedFilePage() {
  const { token } = useParams();

  const [file, setFile] = useState<SharedFileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSharedFile() {
      try {
        setLoading(true);

        const response = await api.get<SharedFileResponse>(`/shared/${token}/info`);
        setFile(response.data);
      } catch (err: any) {
        toast.error(
          err?.response?.data?.error || "Não foi possível carregar o arquivo compartilhado"
        );
        setFile(null);
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchSharedFile();
    }
  }, [token]);

  const showPdf = useMemo(() => {
    if (!file) return false;
    return isPdf(file.mimeType, file.name);
  }, [file]);

  const showImage = useMemo(() => {
    if (!file) return false;
    return isImage(file.mimeType, file.name);
  }, [file]);

  if (loading) {
    return (
      <div className="shared-page">
        <div className="shared-shell">
          <div className="shared-card card">
            <p className="eyebrow">Arquivapp</p>
            <h1 className="shared-title">Carregando arquivo...</h1>
            <p className="muted">
              Aguarde enquanto preparamos o arquivo compartilhado.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!file) {
    return (
      <div className="shared-page">
        <div className="shared-shell">
          <div className="shared-card card">
            <p className="eyebrow">Arquivo compartilhado</p>
            <h1 className="shared-title">Link inválido ou indisponível</h1>
            <p className="muted">
              Esse link pode ter expirado ou não existir mais.
            </p>

            <div className="shared-actions">
              <Link to="/" className="primary-button">
                Ir para o Arquivapp
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shared-page">
      <div className="shared-shell">
        <section className="shared-card card">
          <div className="shared-header">
            <div>
              <p className="eyebrow">Arquivo compartilhado</p>
              <h1 className="shared-title">{file.name}</h1>
              <p className="muted shared-description">
                Compartilhado via Arquivapp.
              </p>
            </div>

            <div className="shared-meta">
              <span>{formatFileSize(file.size)}</span>
            </div>
          </div>

          <div className="shared-actions">
            <a
              href={file.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="primary-button"
            >
              Abrir arquivo
            </a>

            <a
              href={file.fileUrl}
              download={file.name}
              className="ghost-button"
            >
              Baixar arquivo
            </a>
          </div>

          <div className="shared-preview">
            {showPdf ? (
              <iframe
                src={file.fileUrl}
                title={file.name}
                className="shared-preview-frame"
              />
            ) : showImage ? (
              <img
                src={file.fileUrl}
                alt={file.name}
                className="shared-preview-image"
              />
            ) : (
              <div className="shared-empty-state">
                <div className="shared-empty-state__emoji">📄</div>
                <h3>Pré-visualização indisponível</h3>
                <p className="muted">
                  Esse tipo de arquivo não possui visualização embutida.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="shared-brand-note">
          <p className="muted">
            Quer organizar e compartilhar seus arquivos com facilidade?
          </p>
          <Link to="/" className="shared-brand-link">
            Conhecer o Arquivapp
          </Link>
        </section>
      </div>
    </div>
  );
}