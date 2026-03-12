import { useState } from "react";

type Props = {
  onCreate: (name: string) => Promise<void> | void;
  compact?: boolean;
};

export function CreateFolderForm({
  onCreate,
  compact = false,
}: Props) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) return;

    try {
      setLoading(true);
      await onCreate(trimmedName);
      setName("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className={`inline-form responsive-inline-form compact-mobile-form ${
        compact ? "create-folder-form--compact" : ""
      }`}
      onSubmit={handleSubmit}
    >
      <input
        className="input"
        type="text"
        placeholder="Nova pasta"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button
        className="primary-button create-folder-button"
        type="submit"
        disabled={loading}
      >
        {loading ? "Criando..." : "Criar"}
      </button>
    </form>
  );
}