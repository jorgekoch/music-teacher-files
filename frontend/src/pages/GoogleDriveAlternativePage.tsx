import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { PublicLayout } from "../components/PublicLayout";
import { SeoInternalLinks } from "../components/SeoInternalLinks";

export function GoogleDriveAlternativePage() {
  return (
    <>
      <Helmet>
        <title>Alternativa ao Google Drive | Arquivapp</title>

        <meta
          name="description"
          content="Procurando uma alternativa ao Google Drive para organizar arquivos? Conheça o Arquivapp, uma forma simples de armazenar documentos e organizar pastas online."
        />

        <meta
          property="og:title"
          content="Alternativa ao Google Drive | Arquivapp"
        />

        <meta
          property="og:description"
          content="Conheça o Arquivapp como alternativa para organizar arquivos e documentos online."
        />

        <meta
          property="og:url"
          content="https://arquivapp.com.br/alternativa-google-drive"
        />
      </Helmet>

      <PublicLayout>
        <section className="landing-section landing-section--hero card">
          <div className="section-title-block">
            <p className="eyebrow">Comparação</p>

            <h1 className="cta-title">
              Uma alternativa simples ao Google Drive para organizar arquivos
            </h1>

            <p className="muted">
              O Google Drive é uma das plataformas mais conhecidas para
              armazenamento de arquivos. Porém, algumas pessoas procuram
              alternativas mais simples para organizar documentos e manter
              arquivos acessíveis de forma clara.
            </p>
          </div>

          <div className="landing-hero__actions">
            <Link to="/register" className="primary-button">
              Criar conta grátis
            </Link>

            <Link to="/features" className="ghost-button">
              Ver recursos
            </Link>
          </div>
        </section>

        <section className="landing-section card">
          <div className="section-title-block">
            <h2>Por que algumas pessoas procuram alternativas</h2>
          </div>

          <div className="landing-rich-text">
            <p>
              Plataformas grandes oferecem muitas funcionalidades, mas isso
              também pode tornar a experiência mais complexa para quem busca
              apenas organizar arquivos e acessar documentos rapidamente.
            </p>

            <p>
              Por isso, algumas pessoas preferem ferramentas mais diretas para
              guardar documentos importantes e manter uma estrutura de pastas
              mais simples.
            </p>
          </div>
        </section>

        <section className="landing-section card">
          <div className="section-title-block">
            <h2>O que o Arquivapp oferece</h2>
          </div>

          <div className="landing-feature-grid">
            <article className="landing-feature-card">
              <h3>Organização clara por pastas</h3>
              <p>
                Separe documentos e arquivos de forma simples e fácil de navegar.
              </p>
            </article>

            <article className="landing-feature-card">
              <h3>Upload rápido de arquivos</h3>
              <p>
                Envie PDFs, documentos e outros arquivos diretamente para sua conta.
              </p>
            </article>

            <article className="landing-feature-card">
              <h3>Visualização simples</h3>
              <p>
                Consulte arquivos sem precisar navegar por interfaces complexas.
              </p>
            </article>

            <article className="landing-feature-card">
              <h3>Organização para uso diário</h3>
              <p>
                Ideal para documentos pessoais, estudo e arquivos de trabalho.
              </p>
            </article>
          </div>
        </section>

        <section className="landing-section card">
          <div className="section-title-block">
            <h2>Quando usar uma alternativa ao Google Drive</h2>
          </div>

          <div className="landing-rich-text">
            <p>
              Se você procura uma plataforma simples para organizar documentos,
              armazenar arquivos na nuvem e manter conteúdos organizados por
              pastas, ferramentas focadas em organização podem ser uma boa opção.
            </p>

            <p>
              O Arquivapp foi pensado justamente para quem quer uma forma clara
              e prática de manter arquivos organizados e acessíveis.
            </p>
          </div>
        </section>

        <section className="landing-cta card">
          <div>
            <h2>Experimente o Arquivapp</h2>

            <p className="muted">
              Crie sua conta gratuita e organize seus arquivos com mais clareza.
            </p>
          </div>

          <div className="landing-cta__actions">
            <Link to="/register" className="primary-button">
              Criar conta grátis
            </Link>
          </div>
        </section>

        <SeoInternalLinks />
      </PublicLayout>
    </>
  );
}