import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../services/api";
import type { FileItem, Folder, Profile } from "../types";
import { Layout } from "../components/Layout";
import { CreateFolderForm } from "../components/CreateFolderForm";
import { FolderSidebar } from "../components/FolderSidebar";
import { FilePanel } from "../components/FilePanel";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { EditFolderDialog } from "../components/EditFolderDialog";
import { ProfileDialog } from "../components/ProfileDialog";
import { useAuth } from "../hooks/useAuth";

const SELECTED_FOLDER_STORAGE_KEY = "bleize:selectedFolderId";

export function DashboardPage() {
  const { logout } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loadingFolders, setLoadingFolders] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(false);

  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);
  const [folderToEdit, setFolderToEdit] = useState<Folder | null>(null);
  const [fileToDelete, setFileToDelete] = useState<FileItem | null>(null);

  const selectedFolder = useMemo(
    () => folders.find((folder) => folder.id === selectedFolderId) || null,
    [folders, selectedFolderId]
  );

  function saveSelectedFolderId(folderId: number | null) {
    if (folderId === null) {
      localStorage.removeItem(SELECTED_FOLDER_STORAGE_KEY);
      return;
    }

    localStorage.setItem(SELECTED_FOLDER_STORAGE_KEY, String(folderId));
  }

  function getStoredSelectedFolderId() {
    const stored = localStorage.getItem(SELECTED_FOLDER_STORAGE_KEY);

    if (!stored) return null;

    const parsed = Number(stored);

    if (Number.isNaN(parsed)) return null;

    return parsed;
  }

  async function fetchProfile() {
    try {
      const response = await api.get<Profile>("/profile");
      setProfile(response.data);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Erro ao carregar perfil");
    }
  }

  async function fetchFolders() {
    try {
      setLoadingFolders(true);

      const response = await api.get<Folder[]>("/folders/list");
      const folderList = response.data;

      setFolders(folderList);

      if (folderList.length === 0) {
        setSelectedFolderId(null);
        setFiles([]);
        saveSelectedFolderId(null);
        return;
      }

      const storedSelectedFolderId = getStoredSelectedFolderId();

      const folderStillExists = folderList.some(
        (folder) => folder.id === selectedFolderId
      );

      if (selectedFolderId && folderStillExists) {
        return;
      }

      const storedFolderStillExists = folderList.some(
        (folder) => folder.id === storedSelectedFolderId
      );

      if (storedSelectedFolderId && storedFolderStillExists) {
        setSelectedFolderId(storedSelectedFolderId);
        saveSelectedFolderId(storedSelectedFolderId);
        return;
      }

      setSelectedFolderId(folderList[0].id);
      saveSelectedFolderId(folderList[0].id);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Erro ao carregar pastas");
    } finally {
      setLoadingFolders(false);
    }
  }

  async function fetchFiles(folderId: number) {
    try {
      setLoadingFiles(true);
      const response = await api.get<FileItem[]>(`/files/folder/${folderId}`);
      setFiles(response.data);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Erro ao carregar arquivos");
    } finally {
      setLoadingFiles(false);
    }
  }

  function handleSelectFolder(folderId: number) {
    setSelectedFolderId(folderId);
    saveSelectedFolderId(folderId);
  }

  useEffect(() => {
    const storedFolderId = getStoredSelectedFolderId();

    if (storedFolderId) {
      setSelectedFolderId(storedFolderId);
    }

    fetchProfile();
    fetchFolders();
  }, []);

  useEffect(() => {
    if (selectedFolderId) {
      fetchFiles(selectedFolderId);
    }
  }, [selectedFolderId]);

  async function handleCreateFolder(name: string) {
    try {
      const response = await api.post<Folder>("/folders", { name });
      const createdFolder = response.data;

      toast.success("Pasta criada com sucesso.");
      await fetchFolders();

      setSelectedFolderId(createdFolder.id);
      saveSelectedFolderId(createdFolder.id);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Erro ao criar pasta");
    }
  }

  async function handleUpdateFolder(name: string) {
    if (!folderToEdit) return;

    try {
      await api.patch(`/folders/${folderToEdit.id}`, { name });
      toast.success("Pasta renomeada com sucesso.");
      setFolderToEdit(null);
      await fetchFolders();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Erro ao renomear pasta");
      setFolderToEdit(null);
    }
  }

  async function confirmDeleteFolder() {
    if (!folderToDelete) return;

    try {
      const deletedFolderId = folderToDelete.id;

      await api.delete(`/folders/${deletedFolderId}`);
      toast.success("Pasta excluída com sucesso.");
      setFolderToDelete(null);

      if (selectedFolderId === deletedFolderId) {
        setSelectedFolderId(null);
        setFiles([]);
        saveSelectedFolderId(null);
      }

      await fetchFolders();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Erro ao excluir pasta");
      setFolderToDelete(null);
    }
  }

  async function handleUpload(file: File) {
    if (!selectedFolderId) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folderId", String(selectedFolderId));

    try {
      await api.post("/files/upload", formData);
      toast.success("Arquivo enviado com sucesso.");
      await fetchFiles(selectedFolderId);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Erro ao enviar arquivo");
    }
  }

  async function confirmDeleteFile() {
    if (!fileToDelete || !selectedFolderId) return;

    try {
      await api.delete(`/files/${fileToDelete.id}`);
      toast.success("Arquivo excluído com sucesso.");
      setFileToDelete(null);
      await fetchFiles(selectedFolderId);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Erro ao excluir arquivo");
      setFileToDelete(null);
    }
  }

  async function handleUpdateProfile(name: string) {
    try {
      const response = await api.patch<Profile>("/profile", { name });
      setProfile(response.data);
      toast.success("Perfil atualizado com sucesso.");
      setProfileOpen(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Erro ao atualizar perfil");
    }
  }

  async function handleUpdatePassword(currentPassword: string, newPassword: string) {
    try {
      await api.patch("/profile/password", { currentPassword, newPassword });
      toast.success("Senha atualizada com sucesso.");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Erro ao atualizar senha");
    }
  }

  async function handleUpdateAvatar(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.patch<Profile>("/profile/avatar", formData);
      setProfile(response.data);
      toast.success("Foto de perfil atualizada com sucesso.");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Erro ao atualizar foto");
    }
  }

  return (
    <Layout
      profile={profile}
      onProfileClick={() => setProfileOpen(true)}
      onLogout={logout}
    >
      <div className="dashboard-header card">
        <CreateFolderForm onCreate={handleCreateFolder} />
      </div>

      <div className="dashboard-grid">
        <FolderSidebar
          folders={folders}
          selectedFolderId={selectedFolderId}
          loading={loadingFolders}
          onSelectFolder={handleSelectFolder}
          onEditFolder={setFolderToEdit}
          onDeleteFolder={setFolderToDelete}
        />

        <FilePanel
          selectedFolder={selectedFolder}
          files={files}
          loading={loadingFiles}
          onUpload={handleUpload}
          onDeleteFile={setFileToDelete}
        />
      </div>

      <EditFolderDialog
        open={Boolean(folderToEdit)}
        folder={folderToEdit}
        onCancel={() => setFolderToEdit(null)}
        onConfirm={handleUpdateFolder}
      />

      <ConfirmDialog
        open={Boolean(folderToDelete)}
        title="Excluir pasta"
        description={`Tem certeza que deseja excluir a pasta "${folderToDelete?.name}"?`}
        confirmText="Excluir pasta"
        onCancel={() => setFolderToDelete(null)}
        onConfirm={confirmDeleteFolder}
      />

      <ConfirmDialog
        open={Boolean(fileToDelete)}
        title="Excluir arquivo"
        description={`Tem certeza que deseja excluir o arquivo "${fileToDelete?.name}"?`}
        confirmText="Excluir arquivo"
        onCancel={() => setFileToDelete(null)}
        onConfirm={confirmDeleteFile}
      />

      <ProfileDialog
        open={profileOpen}
        profile={profile}
        onClose={() => setProfileOpen(false)}
        onUpdateProfile={handleUpdateProfile}
        onUpdatePassword={handleUpdatePassword}
        onUpdateAvatar={handleUpdateAvatar}
      />
    </Layout>
  );
}