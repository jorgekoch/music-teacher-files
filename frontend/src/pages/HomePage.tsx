import { useState } from "react";
import { Link } from "react-router-dom";
import { PublicHeader } from "../components/PublicHeader";
import { WaitlistDialog } from "../components/WaitlistDialog";

export function HomePage() {
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  return (
    <>
      <div className="public-page">
        <div className="public-shell">
          <PublicHeader />

          <section className="landing-hero">
            <div className="landing-hero__content">
              <p className="landing-hero__tag">Beta público disponível</p>

              <h2 className="landing-hero__title">
                Seus arquivos na nuvem, de forma <span>simples</span>.
              </h2>

              <p className="landing-hero__description">
                Guarde, organize e acesse documentos, PDFs e arquivos importantes
                em um só lugar, com praticidade, privacidade e segurança.
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
              <h3>Encontre tudo com mais facilidade</h3>
              <p className="muted">
                Crie pastas e mantenha seus arquivos organizados sem bagunça.
              </p>
            </div>

            <div className="landing-feature-card">
              <h3>Use sem complicação</h3>
              <p className="muted">
                Uma interface simples e intuitiva para guardar seus arquivos
                rapidamente.
              </p>
            </div>

            <div className="landing-feature-card">
              <h3>Seus arquivos, só seus</h3>
              <p className="muted">
                Seus documentos ficam em uma área privada, protegida por login.
              </p>
            </div>
          </section>

          <section className="landing-section">
            <div className="section-title-block">
              <p className="eyebrow">Como funciona</p>
              <h3 className="cta-title">Comece em poucos passos</h3>
              <p className="muted">
                O Arquivapp foi pensado para ser fácil desde o primeiro acesso.
              </p>
            </div>

            <div className="landing-features">
              <div className="landing-feature-card">
                <h3>1. Crie sua conta</h3>
                <p className="muted">
                  Cadastre-se gratuitamente e acesse sua área pessoal.
                </p>
              </div>

              <div className="landing-feature-card">
                <h3>2. Envie seus arquivos</h3>
                <p className="muted">
                  Faça upload de documentos, PDFs, imagens e outros arquivos
                  importantes.
                </p>
              </div>

              <div className="landing-feature-card">
                <h3>3. Organize como quiser</h3>
                <p className="muted">
                  Separe tudo em pastas e encontre seus arquivos com mais rapidez.
                </p>
              </div>
            </div>
          </section>

          <section className="landing-section">
            <div className="section-title-block">
              <p className="eyebrow">Ideal para</p>
              <h3 className="cta-title">
                Um espaço simples para os arquivos do dia a dia
              </h3>
              <p className="muted">
                Use o Arquivapp para manter seus arquivos importantes sempre
                organizados e acessíveis.
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
                O Arquivapp está disponível gratuitamente em fase Beta. O plano
                PRO será liberado em breve com mais armazenamento e recursos
                extras.
              </p>
            </div>

            <div className="landing-plans__grid">
              <div className="landing-plan-card">
                <p className="landing-plan-card__badge">FREE</p>
                <h4>Plano Gratuito</h4>
                <p className="landing-plan-card__price">R$ 0/mês</p>
                <p className="muted">
                  Perfeito para começar a organizar seus arquivos.
                </p>

                <ul className="landing-plan-card__list">
                  <li>500 MB de armazenamento</li>
                  <li>Organização por pastas</li>
                  <li>Upload simples de arquivos</li>
                  <li>Busca de arquivos</li>
                  <li>Perfil e tema claro/escuro</li>
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
                  Mais espaço e mais possibilidades para quem precisa de mais.
                </p>

                <ul className="landing-plan-card__list">
                  <li>20 GB de armazenamento</li>
                  <li>Arquivos maiores</li>
                  <li>Mais espaço para organização</li>
                  <li>Melhor aproveitamento para uso profissional</li>
                  <li>Recursos avançados nas próximas versões</li>
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
                Crie sua conta, teste o Arquivapp em fase Beta e guarde seus
                arquivos na nuvem de forma simples e segura.
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
        </div>
      </div>

      <WaitlistDialog
        open={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
      />
    </>
  );
}