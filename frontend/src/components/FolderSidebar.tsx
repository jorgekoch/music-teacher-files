import { useState } from "react";
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
  draggingFileId: number | null;
  onDropFileOnFolder: (fileId: number, folderId: number) => void;
};

export function FolderSidebar({
  folders,
  selectedFolderId,
  loading,
  onSelectFolder,
  onEditFolder,
  onDeleteFolder,
  draggingFileId,
  onDropFileOnFolder,
}: Props) {
  const [dragOverFolderId, setDragOverFolderId] = useState<number | null>(null);

  function handleDragOver(e: React.DragEvent<HTMLDivElement>, folderId: number) {
    if (!draggingFileId) return;
    e.preventDefault();
    e.stopPropagation();
    setDragOverFolderId(folderId);
  }

  function handleDragLeave(folderId: number) {
    if (dragOverFolderId === folderId) {
      setDragOverFolderId(null);
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>, folderId: number) {
    e.preventDefault();
    e.stopPropagation();
    setDragOverFolderId(null);

    const fileId = Number(e.dataTransfer.getData("text/plain"));

    if (!fileId) return;

    onDropFileOnFolder(fileId, folderId);
  }

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
          {folders.map((folder) => {
            const isDragTarget =
              draggingFileId !== null && dragOverFolderId === folder.id;

            return (
              <div
                key={folder.id}
                className={`folder-item mobile-folder-item ${
                  selectedFolderId === folder.id ? "active-folder" : ""
                } ${isDragTarget ? "folder-drop-target" : ""}`}
                onDragOver={(e) => handleDragOver(e, folder.id)}
                onDragLeave={() => handleDragLeave(folder.id)}
                onDrop={(e) => handleDrop(e, folder.id)}
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
            );
          })}
        </div>
      )}
    </aside>
  );
}