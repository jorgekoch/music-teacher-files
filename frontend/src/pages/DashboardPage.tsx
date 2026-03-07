import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import type { FileItem, Folder } from "../types";
import { Layout } from "../components/Layout";
import { CreateFolderForm } from "../components/CreateFolderForm";
import { FolderSidebar } from "../components/FolderSidebar";
import { FilePanel } from "../components/FilePanel";

export function DashboardPage() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [error, setError] = useState("");

  const selectedFolder = useMemo(
    () => folders.find((folder) => folder.id === selectedFolderId) || null,
    [folders, selectedFolderId]
  );

  async function fetchFolders() {
    try {
      const response = await api.get<Folder[]>("/folders/list");
      const folderList = response.data;

      setFolders(folderList);

      if (folderList.length > 0 && !selectedFolderId) {
        setSelectedFolderId(folderList[0].id);
      }

      if (folderList.length === 0) {
        setSelectedFolderId(null);
        setFiles([]);
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || "Erro ao carregar pastas");
    }
  }

  async function fetchFiles(folderId: number) {
    try {
      const response = await api.get<FileItem[]>(`/files/folder/${folderId}`);
      setFiles(response.data);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Erro ao carregar arquivos");
    }
  }

  useEffect(() => {
    fetchFolders();
  }, []);

  useEffect(() => {
    if (selectedFolderId) {
      fetchFiles(selectedFolderId);
    }
  }, [selectedFolderId]);

  async function handleCreateFolder(name: string) {
    setError("");
    await api.post("/folders", { name });
    await fetchFolders();
  }

  async function handleDeleteFolder(folderId: number) {
    setError("");

    try {
      await api.delete(`/folders/${folderId}`);
      const wasSelected = selectedFolderId === folderId;

      await fetchFolders();

      if (wasSelected) {
        setFiles([]);
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || "Erro ao excluir pasta");
    }
  }

  async function handleUpload(file: File) {
    if (!selectedFolderId) return;

    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folderId", String(selectedFolderId));

    try {
      await api.post("/files/upload", formData);
      await fetchFiles(selectedFolderId);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Erro ao enviar arquivo");
    }
  }

  async function handleDeleteFile(fileId: number) {
    if (!selectedFolderId) return;

    setError("");

    try {
      await api.delete(`/files/${fileId}`);
      await fetchFiles(selectedFolderId);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Erro ao excluir arquivo");
    }
  }

  return (
    <Layout>
      <div className="dashboard-header card">
        <CreateFolderForm onCreate={handleCreateFolder} />
        {error && <p className="error-text">{error}</p>}
      </div>

      <div className="dashboard-grid">
        <FolderSidebar
          folders={folders}
          selectedFolderId={selectedFolderId}
          onSelectFolder={setSelectedFolderId}
          onDeleteFolder={handleDeleteFolder}
        />

        <FilePanel
          selectedFolder={selectedFolder}
          files={files}
          onUpload={handleUpload}
          onDeleteFile={handleDeleteFile}
        />
      </div>
    </Layout>
  );
}