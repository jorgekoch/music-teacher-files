import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../services/api";
import type { FileItem, Folder, Profile } from "../types";
import { Layout } from "../components/Layout";
import { FolderSidebar } from "../components/FolderSidebar";
import { FilePanel } from "../components/FilePanel";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { EditFolderDialog } from "../components/EditFolderDialog";
import { EditFileDialog } from "../components/EditFileDialog";
import { ProfileDialog } from "../components/ProfileDialog";
import { OnboardingCard } from "../components/OnboardingCard";
import { useAuth } from "../hooks/useAuth";
import { createProCheckoutSession } from "../services/billingService";
import { ShareFolderDialog } from "../components/ShareFolderDialog";
import { getFolderShares, getSharedFolders, removeFolderShare, shareFolder, shareFolder as shareFolderRequest } from "../services/folderShareService";

const SELECTED_FOLDER_STORAGE_KEY = "Arquivapp:selectedFolderId";
const ONBOARDING_DISMISSED_STORAGE_KEY = "Arquivapp:onboardingDismissed";

const DASHBOARD_CACHE_KEY = "Arquivapp:dashboardInitCache";
const DASHBOARD_CACHE_TTL_MS = 20 * 1000;

type DashboardInitResponse = {
  profile: Profile;
  folders: Folder[];
  files: FileItem[];
  selectedFolderId: number | null;
};

type DashboardCachePayload = {
  timestamp: number;
  data: DashboardInitResponse;
};

export function DashboardPage() {
  const { logout, user, setUser } = useAuth();

  const createFolderSectionRef = useRef<HTMLDivElement | null>(null);

  const [profile, setProfile] = useState<Profile | null>(user);
  const [profileOpen, setProfileOpen] = useState(false);

  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loadingFolders, setLoadingFolders] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(false);

  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);
  const [folderToEdit, setFolderToEdit] = useState<Folder | null>(null);
  const [fileToDelete, setFileToDelete] = useState<FileItem | null>(null);
  const [filesToDelete, setFilesToDelete] = useState<FileItem[]>([]);
  const [fileToEdit, setFileToEdit] = useState<FileItem | null>(null);

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedFileIds, setSelectedFileIds] = useState<number[]>([]);
  const [draggingFileId, setDraggingFileId] = useState<number | null>(null);

  const [folderToShare, setFolderToShare] = useState<Folder | null>(null);
  const [sharedFolders, setSharedFolders] = useState<
    { id: number; name: string; ownerName?: string }[]
  >([]);
  const [folderShares, setFolderShares] = useState<
    { id: number; email: string; role: "viewer" | "editor" }[]
  >([]);

  const [selectedFolderMeta, setSelectedFolderMeta] = useState<{isShared: boolean; ownerName?: string} | null>(null);
  const [showProFeatureDialog, setShowProFeatureDialog] = useState(false);

  const selectedFolder = useMemo(() => {
    const ownedFolder =
      folders.find((folder) => folder.id === selectedFolderId) || null;

    if (ownedFolder) {
      return ownedFolder;
    }

    const sharedFolder =
      sharedFolders.find((folder) => folder.id === selectedFolderId) || null;

    if (sharedFolder) {
      return {
        id: sharedFolder.id,
        name: sharedFolder.name,
      };
    }

  return null;
}, [folders, sharedFolders, selectedFolderId]);

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

  function getOnboardingDismissed() {
    return localStorage.getItem(ONBOARDING_DISMISSED_STORAGE_KEY) === "true";
  }

  function dismissOnboarding() {
    localStorage.setItem(ONBOARDING_DISMISSED_STORAGE_KEY, "true");
    setShowOnboarding(false);
  }

  function saveDashboardCache(data: DashboardInitResponse) {
    const payload: DashboardCachePayload = {
      timestamp: Date.now(),
      data,
    };

    sessionStorage.setItem(DASHBOARD_CACHE_KEY, JSON.stringify(payload));
  }

  function getDashboardCache(): DashboardInitResponse | null {
    const raw = sessionStorage.getItem(DASHBOARD_CACHE_KEY);
    if (!raw) return null;

    try {
      const parsed = JSON.parse(raw) as DashboardCachePayload;

      const isExpired =
        Date.now() - parsed.timestamp > DASHBOARD_CACHE_TTL_MS;

      if (isExpired) {
        sessionStorage.removeItem(DASHBOARD_CACHE_KEY);
        return null;
      }

      return parsed.data;
    } catch {
      sessionStorage.removeItem(DASHBOARD_CACHE_KEY);
      return null;
    }
  }

  function clearDashboardCache() {
    sessionStorage.removeItem(DASHBOARD_CACHE_KEY);
  }

  function applyDashboardData(data: DashboardInitResponse) {
    setProfile(data.profile);
    setUser(data.profile);
    setFolders(data.folders);
    setFiles(data.files);
    setSelectedFolderId(data.selectedFolderId);
    setSelectedFileIds([]);
    saveSelectedFolderId(data.selectedFolderId);
  }

  async function fetchProfile() {
    try {
      const response = await api.get<Profile>("/profile");
      setProfile(response.data);
      setUser(response.data);
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
        clearDashboardCache();
        return null;
      }

      const storedSelectedFolderId = getStoredSelectedFolderId();

      const currentFolderStillExists = folderList.some(
        (folder) => folder.id === selectedFolderId
      );

      if (selectedFolderId && currentFolderStillExists) {
        clearDashboardCache();
        return selectedFolderId;
      }

      const storedFolderStillExists = folderList.some(
        (folder) => folder.id === storedSelectedFolderId
      );

      if (storedSelectedFolderId && storedFolderStillExists) {
        setSelectedFolderId(storedSelectedFolderId);
        saveSelectedFolderId(storedSelectedFolderId);
        clearDashboardCache();
        return storedSelectedFolderId;
      }

      setSelectedFolderId(folderList[0].id);
      saveSelectedFolderId(folderList[0].id);
      clearDashboardCache();
      return folderList[0].id;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Erro ao carregar pastas");
      return null;
    } finally {
      setLoadingFolders(false);
    }
  }

  async function fetchFiles(folderId: number) {
    try {
      setLoadingFiles(true);
      const response = await api.get<FileItem[]>(`/files/folder/${folderId}`);
      setFiles(response.data);
      setSelectedFileIds([]);
      clearDashboardCache();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Erro ao carregar arquivos");
    } finally {
      setLoadingFiles(false);
    }
  }

  async function loadInitialDashboard() {
    const cachedData = getDashboardCache();

    if (cachedData) {
      applyDashboardData(cachedData);
      return;
    }

    try {
      setLoadingFolders(true);
      setLoadingFiles(true);

      const storedFolderId = getStoredSelectedFolderId();

      const response = await api.get<DashboardInitResponse>("/dashboard/init", {
        params: storedFolderId ? { folderId: storedFolderId } : {},
      });

      const data = response.data;

      applyDashboardData(data);
      saveDashboardCache(data);
      const initialOwnedFolder =
        data.folders.find((folder) => folder.id === data.selectedFolderId) || null;

      if (initialOwnedFolder) {
        setSelectedFolderMeta({ isShared: false });
      } else {
        const initialSharedFolder =
          sharedFolders.find((folder) => folder.id === data.selectedFolderId) || null;

        if (initialSharedFolder) {
          setSelectedFolderMeta({
            isShared: true,
            ownerName: initialSharedFolder.ownerName,
          });
        } else {
          setSelectedFolderMeta(null);
        }
      }
    } catch (err: any) {
      console.error("Erro real no loadInitialDashboard:", err);
      console.error("Resposta do backend: ", err?.response?.status);

      toast.error(
        err?.response?.data?.error || err?.message || "Erro ao carregar dashboard"
      );
    } finally {
      setLoadingFolders(false);
      setLoadingFiles(false);
    }
  }

  async function handleSelectFolder(folderId: number) {
    setSelectedFolderId(folderId);
    saveSelectedFolderId(folderId);
    setSelectedFileIds([]);

    const ownedFolder = folders.find((folder) => folder.id === folderId);

    if (ownedFolder) {
      setSelectedFolderMeta({
        isShared: false,
      });
    } else {
      const sharedFolder = sharedFolders.find((folder) => folder.id === folderId);

      setSelectedFolderMeta({
        isShared: true,
        ownerName: sharedFolder?.ownerName,
      });
    }

    await fetchFiles(folderId);
  }

  function handleStartOnboarding() {
    createFolderSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function handleToggleFileSelection(fileId: number) {
    setSelectedFileIds((current) =>
      current.includes(fileId)
        ? current.filter((id) => id !== fileId)
        : [...current, fileId]
    );
  }

  function handleSelectAllFiles(fileIds: number[]) {
    setSelectedFileIds(fileIds);
  }

  function handleClearFileSelection() {
    setSelectedFileIds([]);
  }

  function handleDeleteSelectedFiles(selectedFiles: FileItem[]) {
    if (selectedFiles.length === 0) return;
    setFilesToDelete(selectedFiles);
  }

  async function handleShareFolder(folder: Folder) {
    if (profile?.plan !== "PRO") {
      toast("Compartilhamento de pastas é um recurso do plano PRO.");
      return;
    }

    try {
      const response = await getFolderShares(folder.id);

      const mappedShares = response.map((item) => ({
        id: item.id,
        email: item.user.email,
        role: item.role,
      }));

      setFolderShares(mappedShares);
      setFolderToShare(folder);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.error ||
          "Erro ao carregar compartilhamentos da pasta"
      );
    }
  }

  async function handleInviteToFolder(folderId: number, email: string) {
    try {
      await shareFolder(folderId, email);
      toast.success(`Convite enviado para ${email}.`);

      const response = await getFolderShares(folderId);

      const mappedShares = response.map((item) => ({
        id: item.id,
        email: item.user.email,
        role: item.role,
      }));

      setFolderShares(mappedShares);
      await loadSharedFolders();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.error || "Erro ao compartilhar pasta"
      );
    }
  }

  useEffect(() => {
    loadInitialDashboard();
    loadSharedFolders();
  }, []);

  useEffect(() => {
    if (!selectedFolderId) {
      setSelectedFolderMeta(null);
      return;
    }

    const ownedFolder = folders.find((folder) => folder.id === selectedFolderId);

    if (ownedFolder) {
      setSelectedFolderMeta({ isShared: false });
      return;
    }

    const sharedFolder = sharedFolders.find(
      (folder) => folder.id === selectedFolderId
    );

    if (sharedFolder) {
      setSelectedFolderMeta({
        isShared: true,
        ownerName: sharedFolder.ownerName,
      });
      return;
    }

    setSelectedFolderMeta(null);
  }, [selectedFolderId, folders, sharedFolders]);

  useEffect(() => {
    const hasFolders = folders.length > 0;
    const hasFiles = files.length > 0;
    const dismissed = getOnboardingDismissed();

    if (!hasFolders && !hasFiles && !dismissed) {
      setShowOnboarding(true);
      return;
    }

    setShowOnboarding(false);
  }, [folders, files]);

  async function handleCreateFolder(name: string) {
    try {
      const response = await api.post<Folder>("/folders", { name });
      const createdFolder = response.data;

      toast.success("Pasta criada com sucesso.");
      dismissOnboarding();
      clearDashboardCache();

      await fetchFolders();
      setSelectedFolderId(createdFolder.id);
      saveSelectedFolderId(createdFolder.id);
      await fetchFiles(createdFolder.id);
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
      clearDashboardCache();
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
      const wasSelectedFolder = selectedFolderId === deletedFolderId;

      await api.delete(`/folders/${deletedFolderId}`);
      toast.success("Pasta excluída com sucesso.");
      setFolderToDelete(null);
      clearDashboardCache();

      if (wasSelectedFolder) {
        setSelectedFolderId(null);
        setFiles([]);
        saveSelectedFolderId(null);
      }

      const nextFolderId = await fetchFolders();

      if (wasSelectedFolder) {
        if (nextFolderId) {
          await fetchFiles(nextFolderId);
        } else {
          setFiles([]);
        }
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Erro ao excluir pasta");
      setFolderToDelete(null);
    }
  }

  async function handleUpload(file: File) {
    if (!selectedFolderId) return;

    try {
      const prepareResponse = await api.post<{
        uploadUrl: string;
        storageKey: string;
      }>("/files/upload-url", {
        folderId: selectedFolderId,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      });

      const uploadResponse = await fetch(prepareResponse.data.uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error("Falha no upload direto para o R2");
      }

      await api.post("/files/complete-upload", {
        folderId: selectedFolderId,
        fileName: file.name,
        fileSize: file.size,
        storageKey: prepareResponse.data.storageKey,
      });

      dismissOnboarding();
      clearDashboardCache();
      await Promise.all([fetchFiles(selectedFolderId), fetchProfile()]);
    } catch (err: any) {
      const message =
        err?.response?.data?.error ||
        err?.message ||
        "Erro ao enviar arquivo";

      toast.error(message);
    }
  }

  async function handleUpdateFile(name: string) {
    if (!fileToEdit || !selectedFolderId) return;

    try {
      await api.patch(`/files/${fileToEdit.id}`, { name });
      toast.success("Arquivo renomeado com sucesso.");
      setFileToEdit(null);
      clearDashboardCache();
      await fetchFiles(selectedFolderId);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Erro ao renomear arquivo");
      setFileToEdit(null);
    }
  }

  async function handleMoveFile(fileId: number, targetFolderId: number) {
    if (!selectedFolderId) return;

    try {
      await api.patch(`/files/${fileId}/move`, {
        folderId: targetFolderId,
      });

      toast.success("Arquivo movido com sucesso.");
      setDraggingFileId(null);
      setSelectedFileIds([]);
      clearDashboardCache();

      await Promise.all([fetchFolders(), fetchProfile()]);
      await fetchFiles(selectedFolderId);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Erro ao mover arquivo");
      setDraggingFileId(null);
    }
  }

  async function confirmDeleteFile() {
    if (!fileToDelete || !selectedFolderId) return;

    try {
      await api.delete(`/files/${fileToDelete.id}`);
      toast.success("Arquivo excluído com sucesso.");
      setFileToDelete(null);
      clearDashboardCache();
      await Promise.all([fetchFiles(selectedFolderId), fetchProfile()]);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Erro ao excluir arquivo");
      setFileToDelete(null);
    }
  }

  async function confirmDeleteSelectedFiles() {
    if (filesToDelete.length === 0 || !selectedFolderId) return;

    try {
      await Promise.all(
        filesToDelete.map((file) => api.delete(`/files/${file.id}`))
      );

      toast.success(
        filesToDelete.length === 1
          ? "Arquivo excluído com sucesso."
          : `${filesToDelete.length} arquivos excluídos com sucesso.`
      );

      setFilesToDelete([]);
      setSelectedFileIds([]);
      clearDashboardCache();
      await Promise.all([fetchFiles(selectedFolderId), fetchProfile()]);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Erro ao excluir arquivos");
      setFilesToDelete([]);
    }
  }

  async function handleUpdateProfile(name: string) {
    try {
      const response = await api.patch<Profile>("/profile", { name });
      setProfile(response.data);
      setUser(response.data);
      clearDashboardCache();
      toast.success("Perfil atualizado com sucesso.");
      setProfileOpen(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Erro ao atualizar perfil");
    }
  }

  async function handleUpdatePassword(
    currentPassword: string,
    newPassword: string
  ) {
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
      setUser(response.data);
      clearDashboardCache();
      toast.success("Foto de perfil atualizada com sucesso.");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Erro ao atualizar foto");
    }
  }

  async function handleUpgradeToPro() {
    try {
      const checkoutUrl = await createProCheckoutSession();

      if (!checkoutUrl) {
        toast.error("Não foi possível iniciar o checkout.");
        return;
      }

      window.location.href = checkoutUrl;
    } catch (err: any) {
      toast.error(
        err?.response?.data?.error || "Erro ao iniciar o checkout."
      );
    }
  }

  async function loadSharedFolders() {
    try {
      const response = await getSharedFolders();

      const mappedSharedFolders = response.map((item) => ({
        id: item.folder.id,
        name: item.folder.name,
        ownerName: item.owner.name,
      }));

      setSharedFolders(mappedSharedFolders);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.error || "Erro ao carregar pastas compartilhadas"
      );
    }
  }

  async function handleRemoveFolderAccess(shareId: number) {
    if (!folderToShare) return;

    try {
      await removeFolderShare(shareId);
      toast.success("Acesso removido com sucesso.");

      const response = await getFolderShares(folderToShare.id);

      const mappedShares = response.map((item) => ({
        id: item.id,
        email: item.user.email,
        role: item.role,
      }));

      setFolderShares(mappedShares);
      await loadSharedFolders();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.error || "Erro ao remover acesso"
      );
    }
  }

  return (
  <Layout
    profile={profile}
    onProfileClick={() => setProfileOpen(true)}
    onLogout={logout}
  >
    <OnboardingCard
      open={showOnboarding}
      onCreateFolderClick={handleStartOnboarding}
      onDismiss={dismissOnboarding}
    />

    <div ref={createFolderSectionRef} className="dashboard-grid">
      <FolderSidebar
        folders={folders}
        sharedFolders={sharedFolders}
        selectedFolderId={selectedFolderId}
        loading={loadingFolders}
        profile={profile}
        onCreateFolder={handleCreateFolder}
        onSelectFolder={handleSelectFolder}
        onEditFolder={setFolderToEdit}
        onDeleteFolder={setFolderToDelete}
        onShareFolder={handleShareFolder}
        draggingFileId={draggingFileId}
        onDropFileOnFolder={handleMoveFile}
        onUpgradeClick={handleUpgradeToPro}
        onOpenProFeatureDialog={() =>
          setShowProFeatureDialog(true)
        }

      />

      <FilePanel
        selectedFolder={selectedFolder}
        folderMeta={selectedFolderMeta}
        files={files}
        loading={loadingFiles}
        profile={profile}
        onUpload={handleUpload}
        onEditFile={setFileToEdit}
        onDeleteFile={setFileToDelete}
        selectedFileIds={selectedFileIds}
        onToggleFileSelection={handleToggleFileSelection}
        onSelectAllFiles={handleSelectAllFiles}
        onClearFileSelection={handleClearFileSelection}
        onDeleteSelectedFiles={handleDeleteSelectedFiles}
        onStartDraggingFile={setDraggingFileId}
        onEndDraggingFile={() => setDraggingFileId(null)}
      />
    </div>

    <EditFolderDialog
      open={Boolean(folderToEdit)}
      folder={folderToEdit}
      onCancel={() => setFolderToEdit(null)}
      onConfirm={handleUpdateFolder}
    />

    <EditFileDialog
      open={Boolean(fileToEdit)}
      file={fileToEdit}
      onCancel={() => setFileToEdit(null)}
      onConfirm={handleUpdateFile}
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

    <ConfirmDialog
      open={filesToDelete.length > 0}
      title="Excluir arquivos selecionados"
      description={`Tem certeza que deseja excluir ${filesToDelete.length} arquivo(s) selecionado(s)?`}
      confirmText="Excluir arquivos"
      onCancel={() => setFilesToDelete([])}
      onConfirm={confirmDeleteSelectedFiles}
    />

    <ConfirmDialog
      open={showProFeatureDialog}
      title="Recurso exclusivo do plano PRO"
      description="O compartilhamento de pastas está disponível apenas para usuários do plano PRO."
      confirmText="Entendi"
      onCancel={() => setShowProFeatureDialog(false)}
      onConfirm={() => setShowProFeatureDialog(false)}
    />

    <ProfileDialog
      open={profileOpen}
      profile={profile}
      onClose={() => setProfileOpen(false)}
      onUpdateProfile={handleUpdateProfile}
      onUpdatePassword={handleUpdatePassword}
      onUpdateAvatar={handleUpdateAvatar}
    />

    <ShareFolderDialog
      open={Boolean(folderToShare)}
      folder={folderToShare}
      sharedPeople={folderShares}
      onClose={() => {
        setFolderToShare(null);
        setFolderShares([]);
      }}
      onInvite={handleInviteToFolder}
      onRemoveAccess={handleRemoveFolderAccess}
    />
  </Layout>
);
}