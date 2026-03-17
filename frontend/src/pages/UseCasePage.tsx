import { Helmet } from "react-helmet-async";
import { Link, Navigate, useParams } from "react-router-dom";
import { PublicLayout } from "../components/PublicLayout";
import { SeoInternalLinks } from "../components/SeoInternalLinks";
import { useCasePages } from "../data/useCasePages";

export function UseCasePage() {
  const { slug } = useParams<{ slug: string }>();

  const page = useCasePages.find((entry) => entry.slug === slug);

  if (!page) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Helmet>
        <title>{page.title}</title>
        <meta name="description" content={page.description} />
        <meta property="og:title" content={page.title} />
        <meta property="og:description" content={page.description} />
        <meta property="og:url" content={`https://arquivapp.com.br/${page.slug}`} />
      </Helmet>

      <PublicLayout>
        <section className="landing-section landing-section--hero card">
          <div className="section-title-block">
            <p className="eyebrow">{page.heroEyebrow}</p>
            <h1 className="cta-title">{page.heroTitle}</h1>
            <p className="muted">{page.heroDescription}</p>
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
            <h2>{page.problemTitle}</h2>
          </div>

          <div className="landing-rich-text">
            {page.problemParagraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className="landing-section card">
          <div className="section-title-block">
            <h2>{page.solutionTitle}</h2>
          </div>

          <div className="landing-feature-grid">
            {page.solutions.map((solution) => (
              <article key={solution.title} className="landing-feature-card">
                <h3>{solution.title}</h3>
                <p>{solution.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section card">
          <div className="section-title-block">
            <h2>{page.audienceTitle}</h2>
          </div>

          <div className="landing-rich-text">
            {page.audienceParagraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className="landing-cta card">
          <div>
            <h2>{page.ctaTitle}</h2>
            <p className="muted">{page.ctaDescription}</p>
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