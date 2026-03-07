import { useState } from "react";

type Props = {
  disabled: boolean;
  onUpload: (file: File) => Promise<void>;
};

export function UploadFileForm({ disabled, onUpload }: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!selectedFile || disabled) return;

    try {
      setLoading(true);
      await onUpload(selectedFile);
      setSelectedFile(null);

      const input = document.getElementById("file-input") as HTMLInputElement | null;
      if (input) input.value = "";
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="upload-form responsive-upload-form compact-mobile-form" onSubmit={handleSubmit}>
      <input
        id="file-input"
        className="input"
        type="file"
        disabled={disabled}
        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
      />

      <button
        className="primary-button upload-button"
        type="submit"
        disabled={disabled || !selectedFile || loading}
      >
        {loading ? "Enviando..." : "Enviar"}
      </button>
    </form>
  );
}