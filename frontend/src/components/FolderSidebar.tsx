import { useMemo, useState } from "react";
import type { Folder, Profile } from "../types";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { EmptyState } from "./EmptyState";
import { CreateFolderForm } from "./CreateFolderForm";

type SharedFolder = {
  id: number;
  name: string;
  ownerName?: string;
};

type Props = {
  folders: Folder[];
  sharedFolders?: SharedFolder[];
  selectedFolderId: number | null;
  loading: boolean;
  profile: Profile | null;
  onCreateFolder: (name: string) => Promise<void> | void;
  onSelectFolder: (folderId: number) => void;
  onEditFolder: (folder: Folder) => void;
  onDeleteFolder: (folder: Folder) => void;
  onShareFolder: (folder: Folder) => void;
  draggingFileId: number | null;
  onDropFileOnFolder: (fileId: number, folderId: number) => void;
  onUpgradeClick: () => void;
};

type FolderView = "mine" | "shared";

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }

  const digits = value >= 100 || unitIndex === 0 ? 0 : value >= 10 ? 1 : 2;
  return `${value.toFixed(digits)} ${units[unitIndex]}`;
}

export function FolderSidebar({
  folders,
  sharedFolders = [],
  selectedFolderId,
  loading,
  profile,
  onCreateFolder,
  onSelectFolder,
  onEditFolder,
  onDeleteFolder,
  onShareFolder,
  draggingFileId,
  onDropFileOnFolder,
  onUpgradeClick,
}: Props) {
  const [dragOverFolderId, setDragOverFolderId] = useState<number | null>(null);
  const [activeFolderView, setActiveFolderView] = useState<FolderView>("mine");

  function handleDragOver(e: React.DragEvent<HTMLDivElement>, folderId: number) {
    if (!draggingFileId || activeFolderView !== "mine") return;
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
    if (activeFolderView !== "mine") return;

    e.preventDefault();
    e.stopPropagation();
    setDragOverFolderId(null);

    const fileId = Number(e.dataTransfer.getData("text/plain"));

    if (!fileId) return;

    onDropFileOnFolder(fileId, folderId);
  }

  const storageUsed = profile?.storageUsed ?? 0;
  const storageLimit = profile?.storageLimit ?? 0;
  const plan = profile?.plan ?? "FREE";

  const usagePercent =
    storageLimit > 0
      ? Math.min(Math.round((storageUsed / storageLimit) * 100), 100)
      : 0;

  const isFreePlan = plan === "FREE";
  const isWarning = usagePercent >= 80 && usagePercent < 95;
  const isCritical = usagePercent >= 95;

  const displayedSharedFolders = useMemo(() => sharedFolders, [sharedFolders]);

  return (
  <aside className="sidebar card mobile-section-card sidebar-layout">
    <div className="section-header compact-section-header">
      <div>
        <h2>Pastas</h2>
        <p className="muted">Organize seus materiais.</p>
      </div>
    </div>

    <div className="folder-view-toggle">
      <button
        type="button"
        className={`folder-view-toggle__button ${
          activeFolderView === "mine"
            ? "folder-view-toggle__button--active"
            : ""
        }`}
        onClick={() => setActiveFolderView("mine")}
      >
        Minhas
      </button>

      <button
        type="button"
        className={`folder-view-toggle__button ${
          activeFolderView === "shared"
            ? "folder-view-toggle__button--active"
            : ""
        }`}
        onClick={() => setActiveFolderView("shared")}
      >
        Compartilhadas
      </button>
    </div>

    {activeFolderView === "mine" && (
      <div className="sidebar-create-folder">
        <CreateFolderForm onCreate={onCreateFolder} compact />
      </div>
    )}

    <div className="sidebar-folders-scroll">
      {loading ? (
        <LoadingSkeleton lines={5} height={54} />
      ) : activeFolderView === "mine" ? (
        folders.length === 0 ? (
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

                    <span className="folder-name-wrapper">
                      <span className="folder-name-text">
                        {folder.name}
                      </span>
                    </span>
                  </button>

                  <div className="folder-actions">
                    {Number(folder.shareCount ?? 0) > 0 ? (
                      <span
                        className="folder-shared-badge"
                        title={`${folder.shareCount} pessoa(s) com acesso`}
                      >
                        👥 {folder.shareCount}
                      </span>
                    ) : null}

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

                    <button
                      className="icon-button"
                      onClick={() => onShareFolder(folder)}
                      aria-label={`Compartilhar pasta ${folder.name}`}
                    >
                      👥
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : displayedSharedFolders.length === 0 ? (
        <EmptyState
          emoji="👥"
          title="Nenhuma pasta compartilhada"
          description="Quando alguém compartilhar uma pasta com você, ela aparecerá aqui."
        />
      ) : (
        <div className="folder-list mobile-folder-list">
          {displayedSharedFolders.map((folder) => (
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

                <span className="folder-name-wrapper">
                  <span className="folder-name-text">
                    {folder.name}
                  </span>

                  {folder.ownerName && (
                    <span className="folder-shared-meta">
                      de {folder.ownerName}
                    </span>
                  )}
                </span>
              </button>

              <div className="folder-actions">
                <span
                  className="folder-shared-badge"
                  aria-label="Pasta compartilhada"
                  title={`Compartilhada por ${folder.ownerName || "outro usuário"}`}
                >
                  👥
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

    <div className="sidebar-storage card">
      <div className="sidebar-storage__header">
        <p className="sidebar-storage__label">Armazenamento</p>

        <span
          className={`sidebar-storage__plan ${
            isFreePlan
              ? "sidebar-storage__plan--free"
              : "sidebar-storage__plan--pro"
          }`}
        >
          {plan}
        </span>
      </div>

      <strong className="sidebar-storage__value">
        {formatBytes(storageUsed)} de {formatBytes(storageLimit)}
      </strong>

      <p className="muted sidebar-storage__usage-text">
        {usagePercent}% do espaço utilizado
      </p>

      <div className="storage-bar sidebar-storage__bar">
        <div
          className={[
            "storage-fill",
            isWarning ? "storage-fill-warning" : "",
            isCritical ? "storage-fill-critical" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          style={{ width: `${usagePercent}%` }}
        />
      </div>

      {isCritical && (
        <div className="sidebar-storage__alert sidebar-storage__alert--critical">
          Você está muito próximo do limite do seu plano.
        </div>
      )}

      {isWarning && !isCritical && (
        <div className="sidebar-storage__alert sidebar-storage__alert--warning">
          Seu espaço está acabando.
        </div>
      )}

      {isFreePlan && (
        <button
          type="button"
          className="ghost-button full-width small"
          onClick={onUpgradeClick}
        >
          Atualizar para PRO
        </button>
      )}
    </div>
  </aside>
);
}