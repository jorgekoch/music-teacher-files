import { useState } from "react";
import { Link } from "react-router-dom";
import { WaitlistDialog } from "../components/WaitlistDialog";
import { PublicLayout } from "../components/PublicLayout";
import { HowItWorks } from "../components/HowItWorks";
import { FilePreviewFeatures } from "../components/FilePreviewFeatures";

export function HomePage() {
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  return (
    <>
      <PublicLayout>
        <section className="landing-hero">
          <div className="landing-hero__content">
            <p className="landing-hero__tag">Beta público disponível</p>

            <h2 className="landing-hero__title">
              Organize, proteja e acesse seus arquivos em um só lugar.
            </h2>

            <p className="landing-hero__description">
              O Arquivapp é um espaço simples e seguro para guardar documentos,
              PDFs e arquivos importantes na nuvem, com organização por pastas
              e acesso rápido no dia a dia.
            </p>

            <div className="landing-hero__actions">
              <Link to="/register" className="primary-button large-button">
                Criar conta grátis
              </Link>

              <Link to="/login" className="ghost-button large-button">
                Entrar
              </Link>
            </div>

            <p className="muted landing-hero__footnote">
              Comece gratuitamente e teste o Arquivapp em sua fase Beta.
            </p>
          </div>

          <div className="landing-hero__preview">
            <div className="landing-window">
              <div className="landing-window__header">
                <span className="landing-window__dot landing-window__dot--red" />
                <span className="landing-window__dot landing-window__dot--yellow" />
                <span className="landing-window__dot landing-window__dot--green" />
              </div>

              <div className="landing-window__body">
                <div className="landing-window__folder">Documentos pessoais</div>
                <div className="landing-window__folder">Materiais de estudo</div>
                <div className="landing-window__folder">Arquivos importantes</div>
                <div className="landing-window__file">contrato-assinado.pdf</div>
                <div className="landing-window__file">anotacoes-aula.docx</div>
                <div className="landing-window__file">planejamento-2026.pdf</div>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-features">
          <div className="landing-feature-card">
            <h3>Organização sem bagunça</h3>
            <p className="muted">
              Crie pastas e mantenha seus arquivos separados de forma clara e
              fácil de encontrar.
            </p>
          </div>

          <div className="landing-feature-card">
            <h3>Upload simples e rápido</h3>
            <p className="muted">
              Envie seus arquivos com praticidade e acompanhe tudo em uma
              interface direta e intuitiva.
            </p>
          </div>

          <div className="landing-feature-card">
            <h3>Privacidade e segurança</h3>
            <p className="muted">
              Seus arquivos ficam em uma área privada, protegida por login e
              acesso controlado.
            </p>
          </div>
        </section>

        <HowItWorks />
        <FilePreviewFeatures />

        <section className="landing-section">
          <div className="section-title-block">
            <p className="eyebrow">Ideal para</p>
            <h3 className="cta-title">
              Um espaço prático para os arquivos do dia a dia
            </h3>
            <p className="muted">
              Use o Arquivapp para manter seus arquivos importantes sempre
              organizados, acessíveis e protegidos.
            </p>
          </div>

          <div className="landing-features">
            <div className="landing-feature-card">
              <h3>Documentos pessoais</h3>
              <p className="muted">
                Guarde contratos, comprovantes, documentos e arquivos
                importantes em um só lugar.
              </p>
            </div>

            <div className="landing-feature-card">
              <h3>Materiais de estudo</h3>
              <p className="muted">
                Organize apostilas, PDFs, exercícios e conteúdos por pastas.
              </p>
            </div>

            <div className="landing-feature-card">
              <h3>Arquivos de trabalho</h3>
              <p className="muted">
                Mantenha documentos profissionais bem organizados e fáceis de
                acessar.
              </p>
            </div>
          </div>
        </section>

        <section className="landing-plans">
          <div className="section-title-block">
            <p className="eyebrow">Planos</p>
            <h3 className="cta-title">Comece grátis e evolua quando precisar</h3>
            <p className="muted">
              O Arquivapp já está disponível gratuitamente em fase Beta. O plano
              PRO será liberado em breve com mais armazenamento, compartilhamento
              por link e recursos pensados para um uso mais profissional.
            </p>
          </div>

          <div className="landing-plans__grid">
            <div className="landing-plan-card">
              <p className="landing-plan-card__badge">FREE</p>
              <h4>Plano Gratuito</h4>
              <p className="landing-plan-card__price">R$ 0/mês</p>
              <p className="muted">
                Ideal para começar a organizar seus arquivos na nuvem.
              </p>

              <ul className="landing-plan-card__list">
                <li>500 MB de armazenamento</li>
                <li>Organização por pastas</li>
                <li>Upload e gerenciamento de arquivos</li>
                <li>Busca e visualização de arquivos</li>
                <li>Sem compartilhamento por link</li>
              </ul>

              <Link to="/register" className="primary-button full-width">
                Começar grátis
              </Link>
            </div>

            <div className="landing-plan-card landing-plan-card--pro">
              <p className="landing-plan-card__badge landing-plan-card__badge--pro">
                PRO
              </p>
              <h4>Plano Pro</h4>
              <p className="plan-price">
                R$19,90/mês
                <span className="plan-price-note"> (em breve)</span>
              </p>
              <p className="muted">
                Mais espaço e recursos para quem precisa usar o Arquivapp de forma mais avançada.
              </p>

              <ul className="landing-plan-card__list">
                <li>20 GB de armazenamento</li>
                <li>Compartilhamento por link público</li>
                <li>Arquivos maiores por upload</li>
                <li>Mais capacidade para organização</li>
                <li>Uso mais profissional no dia a dia</li>
              </ul>

              <button
                className="ghost-button full-width"
                onClick={() => setWaitlistOpen(true)}
              >
                Quero ser avisado
              </button>
            </div>
          </div>
        </section>

        <section className="landing-cta card">
          <div>
            <p className="eyebrow">Arquivapp</p>
            <h3 className="cta-title">
              Comece grátis e organize seus arquivos com mais facilidade
            </h3>
            <p className="muted">
              Crie sua conta, teste o Arquivapp em fase Beta e tenha um espaço
              simples e seguro para guardar seus arquivos na nuvem.
            </p>
          </div>

          <div className="landing-cta__actions">
            <Link to="/register" className="primary-button">
              Criar conta grátis
            </Link>

            <button
              className="ghost-button"
              onClick={() => setWaitlistOpen(true)}
            >
              Quero saber do PRO
            </button>
          </div>
        </section>
      </PublicLayout>

      <WaitlistDialog
        open={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
      />
    </>
  );
}