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
  const [uploadingCount, setUploadingCount] = useState(0);

  function validateFile(file: File) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error(`Tipo de arquivo não permitido: ${file.name}`);
      return false;
    }

    return true;
  }

  function resetUploadVisualState() {
    setUploadProgress(0);
    setUploadingFileName("");
    setUploadSuccess(false);
    setUploadingCount(0);
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

  async function handleSelectedFiles(files: FileList | File[] | null) {
    if (!files || disabled || loading) return;

    const validFiles = Array.from(files).filter(validateFile);

    if (validFiles.length === 0) {
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      return;
    }

    try {
      setLoading(true);
      setUploadSuccess(false);
      setUploadProgress(0);
      setUploadingCount(validFiles.length);

      if (validFiles.length === 1) {
        setUploadingFileName(validFiles[0].name);
      } else {
        setUploadingFileName(`${validFiles.length} arquivos`);
      }

      startFakeProgress();

      const results = await Promise.allSettled(
        validFiles.map((file) => onUpload(file))
      );

      const successCount = results.filter(
        (result) => result.status === "fulfilled"
      ).length;

      const failedCount = results.length - successCount;

      stopFakeProgress();
      setUploadProgress(100);

      if (successCount > 0) {
        setUploadSuccess(true);
      }

      if (validFiles.length > 1) {
        if (failedCount === 0) {
          toast.success(`${successCount} arquivos enviados com sucesso.`);
        } else if (successCount > 0) {
          toast.success(`${successCount} arquivos enviados com sucesso.`);
          toast.error(`${failedCount} arquivos não puderam ser enviados.`);
        }
      }

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
    void handleSelectedFiles(e.target.files);
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

    void handleSelectedFiles(e.dataTransfer.files);
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
        multiple
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
              ? uploadingCount > 1
                ? "Arquivos enviados com sucesso"
                : "Arquivo enviado com sucesso"
              : loading
              ? uploadingCount > 1
                ? "Enviando arquivos..."
                : "Enviando arquivo..."
              : "Arraste arquivos aqui ou clique para selecionar"}
          </strong>

          <p className="muted upload-dropzone-subtitle">
            {uploadSuccess || loading
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