import { useMemo, useState } from "react";
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

  const filteredFiles = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    if (!normalized) return files;

    return files.filter((file) =>
      file.name.toLowerCase().includes(normalized)
    );
  }, [files, search]);

  function formatFileSize(size?: number | null) {
    if (!size) return "Tamanho desconhecido";

    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    if (size < 1024 * 1024 * 1024)
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;

    return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);

    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  function getFileIcon(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "pdf":
      return "📄";

    case "doc":
    case "docx":
      return "📘";

    case "xls":
    case "xlsx":
      return "📊";

    case "ppt":
    case "pptx":
      return "📈";

    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "webp":
      return "🖼";

    case "mp3":
    case "wav":
      return "🎵";

    case "zip":
    case "rar":
    case "7z":
      return "📦";

    case "txt":
      return "📝";

    default:
      return "📁";
    }
  }

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

      await navigator.clipboard.writeText(response.data.shareUrl);

      setCopiedShareId(file.id);

      toast.success("Link de compartilhamento copiado.");

      setTimeout(() => {
        setCopiedShareId(null);
      }, 2000);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Erro ao compartilhar arquivo");
    } finally {
      setLoadingShareId(null);
    }
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
          description="Escolha uma pasta para visualizar os arquivos."
        />
      </section>
    );
  }

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
        ) : filteredFiles.length === 0 ? (
          <EmptyState
            emoji="📄"
            title={
              files.length === 0
                ? "Nenhum arquivo nesta pasta"
                : "Nenhum resultado encontrado"
            }
            description={
              files.length === 0
                ? "Envie seu primeiro arquivo para começar."
                : "Tente buscar por outro nome de arquivo."
            }
          />
        ) : (
          <div className="file-list mobile-file-list">
            {filteredFiles.map((file) => (
              <div key={file.id} className="file-item mobile-file-item">
                <div className="file-info">
                  <div className="file-meta">
                    <div className="file-title-row">
                      <span className="file-icon">{getFileIcon(file.name)}</span>
                      <strong className="file-name-text">{file.name}</strong>
                    </div>

                    <div className="file-details">
                      <div className="file-size-text">
                        {formatFileSize(file.size)}
                      </div>

                      <div className="file-date-text">
                        enviado em {formatDate(file.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div className="file-links-row">
                    <button
                      className="link-button"
                      onClick={() => handlePreview(file)}
                      disabled={loadingPreviewId === file.id}
                    >
                      {loadingPreviewId === file.id
                        ? "Carregando..."
                        : "Visualizar"}
                    </button>

                    <button
                      className="link-button"
                      onClick={() => handleOpenInNewTab(file)}
                      disabled={loadingOpenId === file.id}
                    >
                      {loadingOpenId === file.id
                        ? "Abrindo..."
                        : "Abrir em nova aba"}
                    </button>

                    <button
                      className={`link-button ${
                        copiedShareId === file.id
                          ? "link-button-success"
                          : ""
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