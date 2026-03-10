import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

type Props = {
  disabled?: boolean;
  onUpload: (file: File) => Promise<void>;
};

const ACCEPTED_TYPES = [
  "application/pdf",
  "audio/mpeg",
  "audio/wav",
  "image/jpeg",
  "image/png",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];

export function UploadFileForm({ disabled = false, onUpload }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingFileName, setUploadingFileName] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  function validateFile(file: File) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Tipo de arquivo não permitido.");
      return false;
    }

    return true;
  }

  function resetUploadVisualState() {
    setUploadProgress(0);
    setUploadingFileName("");
    setUploadSuccess(false);
  }

  function startFakeProgress() {
    if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current);
    }

    progressIntervalRef.current = window.setInterval(() => {
      setUploadProgress((current) => {
        if (current >= 90) return current;

        const increment = current < 40 ? 8 : current < 70 ? 5 : 2;
        return Math.min(current + increment, 90);
      });
    }, 180);
  }

  function stopFakeProgress() {
    if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }

  async function handleSelectedFile(file: File | null) {
    if (!file || disabled || loading) return;

    if (!validateFile(file)) {
      return;
    }

    try {
      setLoading(true);
      setUploadSuccess(false);
      setUploadingFileName(file.name);
      setUploadProgress(0);

      startFakeProgress();

      await onUpload(file);

      stopFakeProgress();
      setUploadProgress(100);
      setUploadSuccess(true);

      window.setTimeout(() => {
        resetUploadVisualState();
      }, 1400);
    } finally {
      stopFakeProgress();
      setLoading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    void handleSelectedFile(file);
  }

  function handleOpenFilePicker() {
    if (disabled || loading) return;
    inputRef.current?.click();
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    if (disabled || loading) return;
    setDragActive(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(false);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(false);

    if (disabled || loading) return;

    const file = e.dataTransfer.files?.[0] || null;
    void handleSelectedFile(file);
  }

  useEffect(() => {
    return () => {
      stopFakeProgress();
    };
  }, []);

  const dropzoneClassName = [
    "upload-dropzone",
    dragActive ? "upload-dropzone-active" : "",
    disabled ? "upload-dropzone-disabled" : "",
    loading ? "upload-dropzone-loading" : "",
    uploadSuccess ? "upload-dropzone-success" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={dropzoneClassName}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleOpenFilePicker}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !disabled && !loading) {
          e.preventDefault();
          handleOpenFilePicker();
        }
      }}
      aria-disabled={disabled}
    >
      <input
        ref={inputRef}
        type="file"
        hidden
        accept=".pdf,.mp3,.wav,.jpg,.jpeg,.png,.doc,.docx"
        onChange={handleInputChange}
      />

      <div className="upload-dropzone-content">
        <div className="upload-dropzone-icon">
          {uploadSuccess ? "✅" : loading ? "⏳" : "📤"}
        </div>

        <div className="upload-dropzone-texts">
          <strong>
            {uploadSuccess
              ? "Arquivo enviado com sucesso"
              : loading
              ? "Enviando arquivo..."
              : "Arraste um arquivo aqui ou clique para selecionar"}
          </strong>

          <p className="muted upload-dropzone-subtitle">
            {uploadSuccess
              ? uploadingFileName
              : loading
              ? uploadingFileName
              : "Formatos aceitos: PDF, MP3, WAV, JPG, PNG, DOC e DOCX"}
          </p>

          {(loading || uploadSuccess) && (
            <div className="upload-progress">
              <div
                className="upload-progress__fill"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          {loading && (
            <span className="upload-progress__label">
              {uploadProgress}% concluído
            </span>
          )}
        </div>
      </div>
    </div>
  );
}