export function FilePreviewFeatures() {
  return (
    <section className="landing-section">
      <div className="section-title-block">
        <h2 className="cta-title">Visualize arquivos sem baixar</h2>
        <p className="subtitle">
          O Arquivapp suporta diversos formatos diretamente no navegador.
        </p>
      </div>

      <div className="landing-features">
        <div className="landing-feature-card">
          <h3>Documentos</h3>
          <p>PDF, DOCX, TXT e Markdown podem ser visualizados diretamente.</p>
        </div>

        <div className="landing-feature-card">
          <h3>Planilhas</h3>
          <p>Abra arquivos CSV e Excel em formato de tabela.</p>
        </div>

        <div className="landing-feature-card">
          <h3>Mídia</h3>
          <p>Visualize imagens, reproduza áudios e assista vídeos.</p>
        </div>
      </div>
    </section>
  );
}