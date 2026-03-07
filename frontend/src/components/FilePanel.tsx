import type { FileItem, Folder } from "../types";
import { UploadFileForm } from "./UploadFileForm";

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
  if (!selectedFolder) {
    return (
      <section className="content card mobile-section-card center-content">
        <div>
          <h2>Nenhuma pasta selecionada</h2>
          <p className="muted">Escolha uma pasta para visualizar os arquivos.</p>
        </div>
      </section>
    );
  }

  return (
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

      {loading ? (
        <p className="muted">Carregando arquivos...</p>
      ) : files.length === 0 ? (
        <p className="muted">Nenhum arquivo nesta pasta.</p>
      ) : (
        <div className="file-list mobile-file-list">
          {files.map((file) => (
            <div key={file.id} className="file-item mobile-file-item">
              <div className="file-info">
                <strong className="file-name-text">{file.name}</strong>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noreferrer"
                  className="file-link"
                >
                  Abrir arquivo
                </a>
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
  );
}