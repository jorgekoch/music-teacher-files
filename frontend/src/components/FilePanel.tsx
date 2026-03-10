import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../services/api";
import type { FileItem, Folder } from "../types";
import { UploadFileForm } from "./UploadFileForm";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { EmptyState } from "./EmptyState";
import { FilePreviewDialog } from "./FilePreviewDialog";

type Props = {
  selectedFolder: Folder | null;
  files: FileItem[];
  loading: boolean;
  onUpload: (file: File) => Promise<void>;
  onEditFile: (file: FileItem) => void;
  onDeleteFile: (file: FileItem) => void;
};

export function FilePanel({
  selectedFolder,
  files,
  loading,
  onUpload,
  onEditFile,
  onDeleteFile,
}: Props) {
  const [search, setSearch] = useState("");
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loadingPreviewId, setLoadingPreviewId] = useState<number | null>(null);
  const [loadingOpenId, setLoadingOpenId] = useState<number | null>(null);
  const [loadingShareId, setLoadingShareId] = useState<number | null>(null);
  const [copiedShareId, setCopiedShareId] = useState<number | null>(null);
  const [lastSharedUrl, setLastSharedUrl] = useState<string | null>(null);
  const [lastSharedFileName, setLastSharedFileName] = useState<string | null>(null);

  const filteredFiles = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    if (!normalized) return files;

    return files.filter((file) =>
      file.name.toLowerCase().includes(normalized)
    );
  }, [files, search]);

  useEffect(() => {
    if (!copiedShareId) return;

    const timeout = window.setTimeout(() => {
      setCopiedShareId(null);
    }, 2200);

    return () => window.clearTimeout(timeout);
  }, [copiedShareId]);

  async function getTemporaryFileUrl(fileId: number) {
    const response = await api.get<{ url: string }>(`/files/${fileId}/download`);
    return response.data.url;
  }

  async function handlePreview(file: FileItem) {
    try {
      setLoadingPreviewId(file.id);
      const url = await getTemporaryFileUrl(file.id);
      setPreviewFile(file);
      setPreviewUrl(url);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Erro ao visualizar arquivo");
    } finally {
      setLoadingPreviewId(null);
    }
  }

  async function handleOpenInNewTab(file: FileItem) {
    try {
      setLoadingOpenId(file.id);
      const url = await getTemporaryFileUrl(file.id);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Erro ao abrir arquivo");
    } finally {
      setLoadingOpenId(null);
    }
  }

  async function handleShare(file: FileItem) {
    try {
      setLoadingShareId(file.id);

      const response = await api.post<{ shareUrl: string }>(
        `/shared/${file.id}/share`
      );

      const shareUrl = response.data.shareUrl;

      await navigator.clipboard.writeText(shareUrl);

      setCopiedShareId(file.id);
      setLastSharedUrl(shareUrl);
      setLastSharedFileName(file.name);

      toast.success("Link de compartilhamento copiado.");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Erro ao compartilhar arquivo");
    } finally {
      setLoadingShareId(null);
    }
  }

  function handleOpenSharedLink() {
    if (!lastSharedUrl) return;
    window.open(lastSharedUrl, "_blank", "noopener,noreferrer");
  }

  function handleClosePreview() {
    setPreviewFile(null);
    setPreviewUrl(null);
  }

  if (!selectedFolder) {
    return (
      <section className="content card mobile-section-card center-content">
        <EmptyState
          emoji="🗂️"
          title="Nenhuma pasta selecionada"
          description="Escolha uma pasta ao lado para visualizar e organizar seus arquivos."
        />
      </section>
    );
  }

  const isFolderEmpty = files.length === 0;
  const hasNoSearchResults = files.length > 0 && filteredFiles.length === 0;

  return (
    <>
      <section className="content card mobile-section-card">
        <div className="section-header compact-section-header file-panel-header">
          <div>
            <h2>{selectedFolder.name}</h2>
            <p className="muted">
              Adicione, visualize e gerencie os arquivos desta pasta.
            </p>
          </div>
        </div>

        <UploadFileForm disabled={!selectedFolder} onUpload={onUpload} />

        {lastSharedUrl && lastSharedFileName && (
          <div className="share-feedback-banner">
            <div>
              <strong>Link copiado com sucesso</strong>
              <p className="muted">
                Arquivo compartilhado: {lastSharedFileName}
              </p>
            </div>

            <button
              className="ghost-button small"
              onClick={handleOpenSharedLink}
            >
              Abrir link
            </button>
          </div>
        )}

        <div className="file-toolbar">
          <input
            className="input"
            type="text"
            placeholder="Buscar arquivos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <LoadingSkeleton lines={5} height={62} />
        ) : isFolderEmpty ? (
          <EmptyState
            emoji="📂"
            title="Esta pasta ainda está vazia"
            description="Envie seu primeiro arquivo para começar a organizar tudo em um só lugar."
          />
        ) : hasNoSearchResults ? (
          <EmptyState
            emoji="🔎"
            title="Nenhum resultado encontrado"
            description={`Não encontramos arquivos com "${search}". Tente buscar por outro nome.`}
          />
        ) : (
          <div className="file-list mobile-file-list">
            {filteredFiles.map((file) => (
              <div key={file.id} className="file-item mobile-file-item">
                <div className="file-info">
                  <strong className="file-name-text">{file.name}</strong>

                  <div className="file-links-row">
                    <button
                      className="link-button"
                      onClick={() => handlePreview(file)}
                      disabled={loadingPreviewId === file.id}
                    >
                      {loadingPreviewId === file.id ? "Carregando..." : "Visualizar"}
                    </button>

                    <button
                      className="link-button"
                      onClick={() => handleOpenInNewTab(file)}
                      disabled={loadingOpenId === file.id}
                    >
                      {loadingOpenId === file.id ? "Abrindo..." : "Abrir em nova aba"}
                    </button>

                    <button
                      className={`link-button ${
                        copiedShareId === file.id ? "link-button-success" : ""
                      }`}
                      onClick={() => handleShare(file)}
                      disabled={loadingShareId === file.id}
                    >
                      {loadingShareId === file.id
                        ? "Copiando..."
                        : copiedShareId === file.id
                        ? "Copiado"
                        : "Compartilhar"}
                    </button>

                    <button
                      className="link-button"
                      onClick={() => onEditFile(file)}
                    >
                      Renomear
                    </button>
                  </div>
                </div>

                <button
                  className="danger-button small file-delete-button"
                  onClick={() => onDeleteFile(file)}
                >
                  Excluir
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <FilePreviewDialog
        open={Boolean(previewFile && previewUrl)}
        file={previewFile}
        fileUrl={previewUrl}
        onClose={handleClosePreview}
      />
    </>
  );
}