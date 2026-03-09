import { useEffect, useState } from "react";
import { getStorageInfo } from "../services/storageService";

export type StorageInfo = {
  used: number;
  limit: number;
  plan: string;
};

export function StorageUsage() {
  const [storage, setStorage] = useState<StorageInfo | null>(null);

  useEffect(() => {
    async function loadStorage() {
      try {
        const data = await getStorageInfo();
        setStorage(data);
      } catch (error) {
        console.error("Erro ao carregar armazenamento", error);
      }
    }

    loadStorage();
  }, []);

  function formatBytes(bytes: number) {
    const mb = bytes / 1024 / 1024;
    const gb = bytes / 1024 / 1024 / 1024;

    if (gb >= 1) {
      return `${gb.toFixed(2)} GB`;
    }

    return `${mb.toFixed(1)} MB`;
  }

  if (!storage) return null;

  const percentage = storage.limit
    ? Math.min((storage.used / storage.limit) * 100, 100)
    : 0;

  return (
    <div className="storage-card card">
      <h3>Armazenamento</h3>

      <p>
        Plano atual: <strong>{storage.plan}</strong>
      </p>

      <div className="storage-bar">
        <div
          className="storage-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="muted">
        {formatBytes(storage.used)} de {formatBytes(storage.limit)} utilizados
      </p>

      {storage.plan === "FREE" && (
        <p className="upgrade-text">
          Precisa de mais espaço? O plano PRO será lançado em breve.
        </p>
      )}
    </div>
  );
}