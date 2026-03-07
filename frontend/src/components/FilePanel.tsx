import { useMemo, useState } from "react";
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
  onDeleteFile: (file: FileItem) => void;
};

export function FilePanel({
  selectedFolder,
  files,
  loading,
  onUpload,
  onDeleteFile,
}: Props) {
  const [search, setSearch] = useState("");
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);

  const filteredFiles = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    if (!normalized) return files;

    return files.filter((file) =>
      file.name.toLowerCase().includes(normalized)
    );
  }, [files, search]);

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
            title={files.length === 0 ? "Nenhum arquivo nesta pasta" : "Nenhum resultado encontrado"}
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
                  <strong className="file-name-text">{file.name}</strong>

                  <div className="file-links-row">
                    <button
                      className="link-button"
                      onClick={() => setPreviewFile(file)}
                    >
                      Visualizar
                    </button>

                    <a
                      href={file.url}
                      target="_blank"
                      rel="noreferrer"
                      className="file-link"
                    >
                      Abrir em nova aba
                    </a>
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
        open={Boolean(previewFile)}
        file={previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </>
  );
}