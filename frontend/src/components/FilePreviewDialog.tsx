import { useEffect, useMemo, useState } from "react";
import mammoth from "mammoth";
import * as XLSX from "xlsx";
import type { FileItem } from "../types";

type Props = {
  open: boolean;
  file: FileItem | null;
  fileUrl: string | null;
  onClose: () => void;
};

type TextPreviewState =
  | {
      status: "idle";
      content: "";
      rows: string[][];
      html: "";
      excelSheetName: "";
    }
  | {
      status: "loading";
      content: "";
      rows: string[][];
      html: "";
      excelSheetName: "";
    }
  | {
      status: "success";
      content: string;
      rows: string[][];
      html: string;
      excelSheetName: string;
    }
  | {
      status: "error";
      content: "";
      rows: string[][];
      html: "";
      excelSheetName: "";
    };

const IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "gif", "webp", "svg"];
const AUDIO_EXTENSIONS = ["mp3", "wav", "ogg", "m4a"];
const ARCHIVE_EXTENSIONS = ["zip", "rar", "7z"];
const VIDEO_EXTENSIONS = ["mp4", "webm", "mov"];
const TEXT_EXTENSIONS = ["txt"];
const MARKDOWN_EXTENSIONS = ["md", "markdown"];
const CSV_EXTENSIONS = ["csv"];
const EXCEL_EXTENSIONS = ["xls", "xlsx"];
const DOCX_EXTENSIONS = ["docx"];
const LEGACY_WORD_EXTENSIONS = ["doc"];
const CODE_EXTENSIONS = [
  "js",
  "ts",
  "jsx",
  "tsx",
  "json",
  "css",
  "scss",
  "sass",
  "html",
  "xml",
  "py",
  "java",
  "c",
  "cpp",
  "cs",
  "php",
  "go",
  "rs",
  "sql",
  "sh",
  "bash",
  "yml",
  "yaml",
];

function getExtension(fileName: string) {
  return fileName.split(".").pop()?.toLowerCase() || "";
}

function getLanguageLabel(extension: string) {
  const labels: Record<string, string> = {
    js: "JavaScript",
    ts: "TypeScript",
    jsx: "JSX",
    tsx: "TSX",
    json: "JSON",
    css: "CSS",
    scss: "SCSS",
    sass: "SASS",
    html: "HTML",
    xml: "XML",
    py: "Python",
    java: "Java",
    c: "C",
    cpp: "C++",
    cs: "C#",
    php: "PHP",
    go: "Go",
    rs: "Rust",
    sql: "SQL",
    sh: "Shell",
    bash: "Bash",
    yml: "YAML",
    yaml: "YAML",
    txt: "Texto",
    md: "Markdown",
    markdown: "Markdown",
    csv: "CSV",
    xls: "Excel",
    xlsx: "Excel",
    docx: "Word",
    doc: "Word legado",
    gif: "GIF",
    zip: "ZIP",
    rar: "RAR",
    "7z": "7Z",
  };

  return labels[extension] || extension.toUpperCase();
}

function parseCsvLine(line: string) {
  const result: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"';
        i += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
      continue;
    }

    if (char === "," && !insideQuotes) {
      result.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  result.push(current.trim());
  return result;
}

function parseCsv(content: string) {
  const lines = content
    .replace(/\r\n/g, "\n")
    .split("\n")
    .filter((line) => line.trim().length > 0);

  return lines.map(parseCsvLine);
}

function renderMarkdownToHtml(markdown: string) {
  const escaped = markdown
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const withHeadings = escaped
    .replace(/^### (.*)$/gm, "<h3>$1</h3>")
    .replace(/^## (.*)$/gm, "<h2>$1</h2>")
    .replace(/^# (.*)$/gm, "<h1>$1</h1>");

  const withBold = withHeadings.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  const withItalic = withBold.replace(/\*(.*?)\*/g, "<em>$1</em>");
  const withInlineCode = withItalic.replace(/`([^`]+)`/g, "<code>$1</code>");

  const paragraphs = withInlineCode
    .split(/\n{2,}/)
    .map((block) => {
      const trimmed = block.trim();

      if (!trimmed) return "";

      if (
        trimmed.startsWith("<h1>") ||
        trimmed.startsWith("<h2>") ||
        trimmed.startsWith("<h3>")
      ) {
        return trimmed;
      }

      if (trimmed.startsWith("- ")) {
        const items = trimmed
          .split("\n")
          .map((line) => line.replace(/^- /, "").trim())
          .filter(Boolean)
          .map((item) => `<li>${item}</li>`)
          .join("");

        return `<ul>${items}</ul>`;
      }

      const lineBreaks = trimmed.replace(/\n/g, "<br />");
      return `<p>${lineBreaks}</p>`;
    })
    .join("");

  return paragraphs;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function highlightCode(content: string, extension: string) {
  const escaped = escapeHtml(content);
  const placeholders: string[] = [];

  function store(match: string, className: string) {
    const token = `__TOKEN_${placeholders.length}__`;
    placeholders.push(`<span class="${className}">${match}</span>`);
    return token;
  }

  let html = escaped;

  if (
    [
      "js",
      "ts",
      "jsx",
      "tsx",
      "java",
      "c",
      "cpp",
      "cs",
      "php",
      "go",
      "rs",
      "sql",
      "css",
      "scss",
      "sass",
    ].includes(extension)
  ) {
    html = html.replace(/(\/\/.*$)/gm, (match) =>
      store(match, "token-comment")
    );
    html = html.replace(/(\/\*[\s\S]*?\*\/)/g, (match) =>
      store(match, "token-comment")
    );
    html = html.replace(/(--.*$)/gm, (match) =>
      store(match, "token-comment")
    );
  }

  if (["py", "sh", "bash", "yml", "yaml"].includes(extension)) {
    html = html.replace(/(#.*$)/gm, (match) => store(match, "token-comment"));
  }

  if (["html", "xml"].includes(extension)) {
    html = html.replace(/(&lt;!--[\s\S]*?--&gt;)/g, (match) =>
      store(match, "token-comment")
    );
  }

  html = html.replace(/("([^"\\]|\\.)*")/g, (match) =>
    store(match, "token-string")
  );
  html = html.replace(/('([^'\\]|\\.)*')/g, (match) =>
    store(match, "token-string")
  );
  html = html.replace(/(`([^`\\]|\\.)*`)/g, (match) =>
    store(match, "token-string")
  );

  html = html.replace(/\b(\d+(\.\d+)?)\b/g, (match) =>
    store(match, "token-number")
  );

  const keywords = [
    "const",
    "let",
    "var",
    "function",
    "return",
    "if",
    "else",
    "switch",
    "case",
    "break",
    "default",
    "for",
    "while",
    "do",
    "try",
    "catch",
    "finally",
    "throw",
    "class",
    "extends",
    "implements",
    "interface",
    "type",
    "import",
    "export",
    "from",
    "async",
    "await",
    "new",
    "null",
    "undefined",
    "true",
    "false",
    "public",
    "private",
    "protected",
    "static",
    "void",
    "this",
    "super",
    "typeof",
    "instanceof",
    "in",
    "of",
    "def",
    "lambda",
    "raise",
    "except",
    "elif",
    "with",
    "as",
    "SELECT",
    "FROM",
    "WHERE",
    "INSERT",
    "UPDATE",
    "DELETE",
    "JOIN",
    "LEFT",
    "RIGHT",
    "INNER",
    "OUTER",
    "CREATE",
    "TABLE",
    "VALUES",
  ];

  const keywordRegex = new RegExp(`\\b(${keywords.join("|")})\\b`, "g");

  html = html.replace(keywordRegex, (match) =>
    store(match, "token-keyword")
  );

  if (["html", "xml"].includes(extension)) {
    html = html.replace(
      /(&lt;\/?[a-zA-Z0-9:-]+)(.*?)(\/?&gt;)/g,
      (_, start, attrs, end) => {
        return `${store(start, "token-tag")}${attrs}${store(
          end,
          "token-tag"
        )}`;
      }
    );

    html = html.replace(/(\s[a-zA-Z-:]+)(=)/g, (_, attr, equal) => {
      return `${store(attr, "token-attr")}${equal}`;
    });
  }

  html = html.replace(/__TOKEN_(\d+)__/g, (_, index) => {
    return placeholders[Number(index)];
  });

  return html;
}

function normalizeSheetRows(rows: unknown[][], maxRows = 50, maxCols = 20) {
  return rows.slice(0, maxRows).map((row) =>
    row.slice(0, maxCols).map((cell) => {
      if (cell === null || cell === undefined) return "";
      if (cell instanceof Date) return cell.toLocaleDateString("pt-BR");
      return String(cell);
    })
  );
}

export function FilePreviewDialog({ open, file, fileUrl, onClose }: Props) {
  const [textPreview, setTextPreview] = useState<TextPreviewState>({
    status: "idle",
    content: "",
    rows: [],
    html: "",
    excelSheetName: "",
  });

  const extension = useMemo(() => {
    if (!file) return "";
    return getExtension(file.name);
  }, [file]);

  const previewType = useMemo(() => {
    if (!extension) return "unknown";
    if (extension === "pdf") return "pdf";
    if (IMAGE_EXTENSIONS.includes(extension)) return "image";
    if (AUDIO_EXTENSIONS.includes(extension)) return "audio";
    if (ARCHIVE_EXTENSIONS.includes(extension)) return "archive";
    if (VIDEO_EXTENSIONS.includes(extension)) return "video";
    if (TEXT_EXTENSIONS.includes(extension)) return "text";
    if (MARKDOWN_EXTENSIONS.includes(extension)) return "markdown";
    if (CSV_EXTENSIONS.includes(extension)) return "csv";
    if (EXCEL_EXTENSIONS.includes(extension)) return "excel";
    if (DOCX_EXTENSIONS.includes(extension)) return "docx";
    if (LEGACY_WORD_EXTENSIONS.includes(extension)) return "doc";
    if (CODE_EXTENSIONS.includes(extension)) return "code";
    return "unknown";
  }, [extension]);

  useEffect(() => {
    if (!open || !fileUrl) {
      setTextPreview({
        status: "idle",
        content: "",
        rows: [],
        html: "",
        excelSheetName: "",
      });
      return;
    }

    const currentFileUrl = fileUrl;

    const needsTextFetch =
      previewType === "text" ||
      previewType === "markdown" ||
      previewType === "csv" ||
      previewType === "excel" ||
      previewType === "docx" ||
      previewType === "code";

    if (!needsTextFetch) {
      setTextPreview({
        status: "idle",
        content: "",
        rows: [],
        html: "",
        excelSheetName: "",
      });
      return;
    }

    let isCancelled = false;

    async function loadTextPreview() {
      try {
        setTextPreview({
          status: "loading",
          content: "",
          rows: [],
          html: "",
          excelSheetName: "",
        });

        if (previewType === "docx") {
          const response = await fetch(currentFileUrl);

          if (!response.ok) {
            throw new Error("Não foi possível carregar o arquivo DOCX.");
          }

          const arrayBuffer = await response.arrayBuffer();
          const result = await mammoth.convertToHtml({ arrayBuffer });

          if (isCancelled) return;

          setTextPreview({
            status: "success",
            content: "",
            rows: [],
            html: result.value,
            excelSheetName: "",
          });

          return;
        }

        if (previewType === "excel") {
          const response = await fetch(currentFileUrl);

          if (!response.ok) {
            throw new Error("Não foi possível carregar a planilha.");
          }

          const arrayBuffer = await response.arrayBuffer();
          const workbook = XLSX.read(arrayBuffer, {
            type: "array",
            cellDates: true,
          });

          const firstSheetName = workbook.SheetNames[0];

          if (!firstSheetName) {
            throw new Error("Planilha sem abas disponíveis.");
          }

          const worksheet = workbook.Sheets[firstSheetName];
          const rawRows = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
            header: 1,
            raw: false,
            defval: "",
            blankrows: false,
          });

          const rows = normalizeSheetRows(rawRows);

          if (isCancelled) return;

          setTextPreview({
            status: "success",
            content: "",
            rows,
            html: "",
            excelSheetName: firstSheetName,
          });

          return;
        }

        const response = await fetch(currentFileUrl);

        if (!response.ok) {
          throw new Error("Não foi possível carregar o conteúdo do arquivo.");
        }

        const content = await response.text();

        if (isCancelled) return;

        if (previewType === "csv") {
          const rows = parseCsv(content).slice(0, 50);

          setTextPreview({
            status: "success",
            content,
            rows,
            html: "",
            excelSheetName: "",
          });

          return;
        }

        setTextPreview({
          status: "success",
          content,
          rows: [],
          html: "",
          excelSheetName: "",
        });
      } catch {
        if (isCancelled) return;

        setTextPreview({
          status: "error",
          content: "",
          rows: [],
          html: "",
          excelSheetName: "",
        });
      }
    }

    void loadTextPreview();

    return () => {
      isCancelled = true;
    };
  }, [open, fileUrl, previewType]);

  useEffect(() => {
    if (!open) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open || !file || !fileUrl) return null;

  const safeFile = file;
  const safeFileUrl = fileUrl;

  function handleOverlayClick() {
    onClose();
  }

  function handleDialogClick(event: React.MouseEvent<HTMLDivElement>) {
    event.stopPropagation();
  }

  function renderTable(rows: string[][], label?: string) {
    if (rows.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-state-emoji">📊</div>
          <h3>Arquivo vazio</h3>
          <p>Não há dados para mostrar neste arquivo.</p>
        </div>
      );
    }

    const maxColumns = rows.reduce((acc, row) => Math.max(acc, row.length), 0);
    const paddedRows = rows.map((row) => {
      const copy = [...row];
      while (copy.length < maxColumns) copy.push("");
      return copy;
    });

    const header = paddedRows[0];
    const body = paddedRows.slice(1);

    return (
      <div className="text-preview-wrapper">
        <div className="text-preview-toolbar">
          <span className="preview-type-badge">
            {getLanguageLabel(extension)}
          </span>

          {label ? <span className="preview-meta-badge">{label}</span> : null}
        </div>

        <div className="csv-preview-table-wrapper">
          <table className="csv-preview-table">
            <thead>
              <tr>
                {header.map((cell, index) => (
                  <th key={`${cell}-${index}`}>{cell || `Coluna ${index + 1}`}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {body.map((row, rowIndex) => (
                <tr key={`row-${rowIndex}`}>
                  {row.map((cell, colIndex) => (
                    <td key={`cell-${rowIndex}-${colIndex}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function renderPreview() {
    if (previewType === "image") {
      return (
        <img
          src={safeFileUrl}
          alt={safeFile.name}
          className="preview-image"
        />
      );
    }

    if (previewType === "pdf") {
      return (
        <iframe
          src={safeFileUrl}
          title={safeFile.name}
          className="preview-frame"
        />
      );
    }

    if (previewType === "audio") {
      return (
        <div className="audio-preview">
          <audio controls className="audio-player">
            <source src={safeFileUrl} />
            Seu navegador não suporta reprodução de áudio.
          </audio>
        </div>
      );
    }

    if (previewType === "video") {
      return (
        <div className="video-preview">
          <video controls className="video-player">
            <source src={safeFileUrl} />
            Seu navegador não suporta reprodução de vídeo.
          </video>
        </div>
      );
    }

    if (previewType === "doc") {
      return (
        <div className="empty-state">
          <div className="empty-state-emoji">📘</div>
          <h3>Pré-visualização limitada para .doc</h3>
          <p>
            Arquivos Word no formato antigo (.doc) não possuem visualização
            embutida no navegador. Para uma melhor experiência, converta o
            arquivo para <strong>.docx</strong> ou abra em uma nova aba.
          </p>
        </div>
      );
    }

    if (
      previewType === "text" ||
      previewType === "code" ||
      previewType === "markdown" ||
      previewType === "csv" ||
      previewType === "excel" ||
      previewType === "docx"
    ) {
      if (textPreview.status === "loading") {
        return (
          <div className="empty-state">
            <div className="empty-state-emoji">⏳</div>
            <h3>Carregando pré-visualização</h3>
            <p>Estamos preparando o conteúdo do arquivo.</p>
          </div>
        );
      }

      if (textPreview.status === "error") {
        return (
          <div className="empty-state">
            <div className="empty-state-emoji">⚠️</div>
            <h3>Não foi possível carregar o preview</h3>
            <p>
              Tente abrir o arquivo em uma nova aba para visualizar o conteúdo.
            </p>
          </div>
        );
      }

      if (previewType === "csv") {
        return renderTable(textPreview.rows);
      }

      if (previewType === "excel") {
        return renderTable(
          textPreview.rows,
          textPreview.excelSheetName
            ? `Aba: ${textPreview.excelSheetName}`
            : undefined
        );
      }

      if (previewType === "markdown") {
        return (
          <div className="text-preview-wrapper">
            <div className="text-preview-toolbar">
              <span className="preview-type-badge">
                {getLanguageLabel(extension)}
              </span>
            </div>

            <div
              className="markdown-preview"
              dangerouslySetInnerHTML={{
                __html: renderMarkdownToHtml(textPreview.content),
              }}
            />
          </div>
        );
      }

      if (previewType === "docx") {
        return (
          <div className="text-preview-wrapper">
            <div className="text-preview-toolbar">
              <span className="preview-type-badge">
                {getLanguageLabel(extension)}
              </span>
            </div>

            <div
              className="docx-preview"
              dangerouslySetInnerHTML={{ __html: textPreview.html }}
            />
          </div>
        );
      }

      if (previewType === "code") {
        return (
          <div className="text-preview-wrapper">
            <div className="text-preview-toolbar">
              <span className="preview-type-badge">
                {getLanguageLabel(extension)}
              </span>
            </div>

            <pre
              className="text-preview-content code-preview-content"
              dangerouslySetInnerHTML={{
                __html: highlightCode(textPreview.content, extension),
              }}
            />
          </div>
        );
      }

      return (
        <div className="text-preview-wrapper">
          <div className="text-preview-toolbar">
            <span className="preview-type-badge">
              {getLanguageLabel(extension)}
            </span>
          </div>

          <pre className="text-preview-content">
            <code>{textPreview.content}</code>
          </pre>
        </div>
      );
    }

    if (previewType === "archive") {
      return (
        <div className="empty-state">
          <div className="empty-state-emoji">📦</div>
          <h3>Arquivo compactado</h3>
          <p>
            Arquivos ZIP e RAR não possuem visualização embutida. Você pode abrir em
            nova aba ou baixar o arquivo para extrair o conteúdo.
          </p>
        </div>
      );
    }

    return (
      <div className="empty-state">
        <div className="empty-state-emoji">📄</div>
        <h3>Preview indisponível</h3>
        <p>Esse tipo de arquivo ainda não possui visualização embutida.</p>
      </div>
    );
  }

  return (
    <div className="dialog-overlay" onClick={handleOverlayClick}>
      <div
        className="dialog-card preview-dialog-card scrollable-dialog"
        onClick={handleDialogClick}
      >
        <div className="preview-header">
          <div>
            <h3>{safeFile.name}</h3>
            <p className="muted">Pré-visualização do arquivo</p>
          </div>

          <button className="ghost-button small" onClick={onClose}>
            Fechar
          </button>
        </div>

        <div className="preview-body">{renderPreview()}</div>

        <a
          href={safeFileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ghost-button preview-open-link"
        >
          Abrir em nova aba
        </a>
      </div>
    </div>
  );
}