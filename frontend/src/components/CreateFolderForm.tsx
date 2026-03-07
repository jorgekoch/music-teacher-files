import { useState } from "react";

type Props = {
  onCreate: (name: string) => Promise<void>;
};

export function CreateFolderForm({ onCreate }: Props) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim()) return;

    try {
      setLoading(true);
      await onCreate(name.trim());
      setName("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="inline-form responsive-inline-form compact-mobile-form" onSubmit={handleSubmit}>
      <input
        className="input"
        type="text"
        placeholder="Nova pasta"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button className="primary-button create-folder-button" type="submit" disabled={loading}>
        {loading ? "Criando..." : "Criar"}
      </button>
    </form>
  );
}