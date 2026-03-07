import type { Folder } from "../types";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { EmptyState } from "./EmptyState";

type Props = {
  folders: Folder[];
  selectedFolderId: number | null;
  loading: boolean;
  onSelectFolder: (folderId: number) => void;
  onEditFolder: (folder: Folder) => void;
  onDeleteFolder: (folder: Folder) => void;
};

export function FolderSidebar({
  folders,
  selectedFolderId,
  loading,
  onSelectFolder,
  onEditFolder,
  onDeleteFolder,
}: Props) {
  return (
    <aside className="sidebar card mobile-section-card">
      <div className="section-header compact-section-header">
        <div>
          <h2>Pastas</h2>
          <p className="muted">Organize seus materiais.</p>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton lines={5} height={54} />
      ) : folders.length === 0 ? (
        <EmptyState
          emoji="📁"
          title="Nenhuma pasta criada"
          description="Crie sua primeira pasta para começar a organizar seus arquivos."
        />
      ) : (
        <div className="folder-list mobile-folder-list">
          {folders.map((folder) => (
            <div
              key={folder.id}
              className={`folder-item mobile-folder-item ${
                selectedFolderId === folder.id ? "active-folder" : ""
              }`}
            >
              <button
                className="folder-name-button"
                onClick={() => onSelectFolder(folder.id)}
              >
                <span className="folder-emoji">📁</span>
                <span className="folder-name-text">{folder.name}</span>
              </button>

              <div className="folder-actions">
                <button
                  className="icon-button"
                  onClick={() => onEditFolder(folder)}
                  aria-label={`Renomear pasta ${folder.name}`}
                >
                  ✏️
                </button>

                <button
                  className="icon-button danger"
                  onClick={() => onDeleteFolder(folder)}
                  aria-label={`Excluir pasta ${folder.name}`}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}