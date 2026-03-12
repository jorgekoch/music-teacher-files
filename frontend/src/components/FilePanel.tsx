import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../services/api";
import type { FileItem, Folder, Profile } from "../types";
import { UploadFileForm } from "./UploadFileForm";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { EmptyState } from "./EmptyState";
import { FilePreviewDialog } from "./FilePreviewDialog";
import { ConfirmDialog } from "./ConfirmDialog";

type Props = {
  selectedFolder: Folder | null;
  files: FileItem[];
  loading: boolean;
  profile: Profile | null;
  onUpload: (file: File) => Promise<void>;
  onEditFile: (file: FileItem) => void;
  onDeleteFile: (file: FileItem) => void;
  selectedFileIds: number[];
  onToggleFileSelection: (fileId: number) => void;
  onSelectAllFiles: (fileIds: number[]) => void;
  onClearFileSelection: () => void;
  onDeleteSelectedFiles: (files: FileItem[]) => void;
  onStartDraggingFile: (fileId: number) => void;
  onEndDraggingFile: () => void;
};

type SortOption =
  | "newest"
  | "oldest"
  | "name-asc"
  | "name-desc"
  | "size-desc"
  | "size-asc";

type ViewMode = "list" | "grid";

export function FilePanel({
  selectedFolder,
  files,
  loading,
  profile,
  onUpload,
  onEditFile,
  onDeleteFile,
  selectedFileIds,
  onToggleFileSelection,
  onSelectAllFiles,
  onClearFileSelection,
  onDeleteSelectedFiles,
  onStartDraggingFile,
  onEndDraggingFile,
}: Props) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loadingPreviewId, setLoadingPreviewId] = useState<number | null>(null);
  const [loadingOpenId, setLoadingOpenId] = useState<number | null>(null);
  const [loadingShareId, setLoadingShareId] = useState<number | null>(null);
  const [copiedShareId, setCopiedShareId] = useState<number | null>(null);
  const [showProFeatureDialog, setShowProFeatureDialog] = useState(false);

  const isPro = profile?.plan === "PRO";

  const filteredFiles = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    if (!normalized) return files;

    return files.filter((file) =>
      file.name.toLowerCase().includes(normalized)
    );
  }, [files, search]);

  const sortedFiles = useMemo(() => {
    const list = [...filteredFiles];

    switch (sortBy) {
      case "newest":
        return list.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

      case "oldest":
        return list.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

      case "name-asc":
        return list.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

      case "name-desc":
        return list.sort((a, b) => b.name.localeCompare(a.name, "pt-BR"));

      case "size-desc":
        return list.sort((a, b) => (b.size ?? 0) - (a.size ?? 0));

      case "size-asc":
        return list.sort((a, b) => (a.size ?? 0) - (b.size ?? 0));

      default:
        return list;
    }
  }, [filteredFiles, sortBy]);

  const selectedFilesInCurrentView = useMemo(
    () => sortedFiles.filter((file) => selectedFileIds.includes(file.id)),
    [sortedFiles, selectedFileIds]
  );

  const allVisibleSelected =
    sortedFiles.length > 0 &&
    sortedFiles.every((file) => selectedFileIds.includes(file.id));

  function formatFileSize(size?: number | null) {
    if (!size) return "Tamanho desconhecido";

    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    if (size < 1024 * 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }

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
      case "csv":
        return "📊";
      case "ppt":
      case "pptx":
        return "📈";
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "webp":
      case "svg":
        return "🖼";
      case "mp3":
      case "wav":
      case "ogg":
      case "m4a":
        return "🎵";
      case "mp4":
      case "webm":
      case "mov":
        return "🎬";
      case "zip":
      case "rar":
      case "7z":
        return "📦";
      case "txt":
      case "md":
      case "json":
      case "js":
      case "ts":
      case "jsx":
      case "tsx":
      case "html":
      case "css":
      case "py":
      case "java":
      case "sql":
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
    if (!isPro) {
      setShowProFeatureDialog(true);
      return;
    }

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

  function handleSelectAllVisible() {
    onSelectAllFiles(sortedFiles.map((file) => file.id));
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

          <div className="file-panel-controls">
            <div className="view-mode-toggle">
              <button
                type="button"
                className={`view-mode-button ${
                  viewMode === "list" ? "view-mode-button-active" : ""
                }`}
                onClick={() => setViewMode("list")}
              >
                Lista
              </button>

              <button
                type="button"
                className={`view-mode-button ${
                  viewMode === "grid" ? "view-mode-button-active" : ""
                }`}
                onClick={() => setViewMode("grid")}
              >
                Grade
              </button>
            </div>

            <div className="file-sort-compact">
              <span className="file-sort-label">Ordenação</span>

              <select
                className="file-sort-compact__select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
              >
                <option value="newest">Recentes</option>
                <option value="oldest">Antigos</option>
                <option value="name-asc">Nome A-Z</option>
                <option value="name-desc">Nome Z-A</option>
                <option value="size-desc">Maior tamanho</option>
                <option value="size-asc">Menor tamanho</option>
              </select>
            </div>
          </div>
        </div>

        <UploadFileForm
         disabled={!selectedFolder}
         profile={profile} 
         onUpload={onUpload} 
        />

        <div className="file-toolbar">
          <input
            className="input"
            type="text"
            placeholder="Buscar arquivos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {selectedFileIds.length > 0 && (
          <div className="file-bulk-actions">
            <div>
              <strong>{selectedFileIds.length} arquivo(s) selecionado(s)</strong>
              <p className="muted">
                Você pode limpar a seleção ou excluir os arquivos selecionados.
              </p>
            </div>

            <div className="file-bulk-actions__buttons">
              <button
                className="ghost-button small"
                onClick={
                  allVisibleSelected ? onClearFileSelection : handleSelectAllVisible
                }
              >
                {allVisibleSelected ? "Limpar seleção" : "Selecionar visíveis"}
              </button>

              <button
                className="danger-button small"
                onClick={() => onDeleteSelectedFiles(selectedFilesInCurrentView)}
              >
                Excluir selecionados
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <LoadingSkeleton lines={5} height={62} />
        ) : sortedFiles.length === 0 ? (
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
          <div
            className={`file-list mobile-file-list ${
              viewMode === "grid" ? "file-list-grid" : ""
            }`}
          >
            {sortedFiles.map((file) => {
              const isSelected = selectedFileIds.includes(file.id);

              return (
                <div
                  key={file.id}
                  className={`file-item mobile-file-item ${
                    isSelected ? "file-item-selected" : ""
                  } ${viewMode === "grid" ? "file-item-grid" : ""}`}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", String(file.id));
                    e.dataTransfer.effectAllowed = "move";
                    onStartDraggingFile(file.id);
                  }}
                  onDragEnd={onEndDraggingFile}
                >
                  <div className="file-selection">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleFileSelection(file.id)}
                      aria-label={`Selecionar ${file.name}`}
                    />
                  </div>

                  <div className="file-info">
                    <div className="file-meta">
                      <div className="file-title-row">
                        <span className="file-icon">{getFileIcon(file.name)}</span>
                        <strong className="file-name-text">{file.name}</strong>
                      </div>

                      <div className="file-details-stack">
                        <div className="file-size-line">
                          {formatFileSize(file.size)}
                        </div>

                        <div className="file-date-line">
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
                          copiedShareId === file.id ? "link-button-success" : ""
                        }`}
                        onClick={() => handleShare(file)}
                        disabled={loadingShareId === file.id}
                        title={!isPro ? "Disponível apenas no plano PRO" : ""}
                      >
                        {!isPro
                          ? "Compartilhar (PRO)"
                          : loadingShareId === file.id
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
              );
            })}
          </div>
        )}
      </section>

      <FilePreviewDialog
        open={Boolean(previewFile && previewUrl)}
        file={previewFile}
        fileUrl={previewUrl}
        onClose={handleClosePreview}
      />

      <ConfirmDialog
        open={showProFeatureDialog}
        title="Recurso exclusivo do plano PRO"
        description="O compartilhamento por link público está disponível apenas para usuários do plano PRO."
        confirmText="Entendi"
        onCancel={() => setShowProFeatureDialog(false)}
        onConfirm={() => setShowProFeatureDialog(false)}
      />
    </>
  );
}