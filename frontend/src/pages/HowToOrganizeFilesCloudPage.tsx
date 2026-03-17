import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { PublicLayout } from "../components/PublicLayout";
import { SeoInternalLinks } from "../components/SeoInternalLinks";

export function HowToOrganizeFilesCloudPage() {
  return (
    <>
      <Helmet>
        <title>Como organizar arquivos na nuvem | Guia prático | Arquivapp</title>

        <meta
          name="description"
          content="Aprenda como organizar arquivos na nuvem de forma simples. Veja dicas para organizar documentos, PDFs e arquivos importantes online."
        />

        <meta
          property="og:title"
          content="Como organizar arquivos na nuvem | Arquivapp"
        />

        <meta
          property="og:description"
          content="Veja um guia simples para organizar arquivos online e manter documentos sempre acessíveis."
        />

        <meta
          property="og:url"
          content="https://arquivapp.com.br/como-organizar-arquivos-na-nuvem"
        />
      </Helmet>

      <PublicLayout>
        <section className="landing-section landing-section--hero card">
          <div className="section-title-block">
            <p className="eyebrow">Guia prático</p>

            <h1 className="cta-title">
              Como organizar arquivos na nuvem de forma simples
            </h1>

            <p className="muted">
              Manter arquivos espalhados em diferentes dispositivos pode gerar
              confusão e perda de tempo. Organizar arquivos na nuvem ajuda a
              centralizar documentos importantes e facilita o acesso no dia a dia.
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
            <h2>Por que organizar arquivos online</h2>
          </div>

          <div className="landing-rich-text">
            <p>
              Quando documentos ficam espalhados entre computador, celular e
              serviços diferentes, encontrar arquivos pode se tornar difícil.
              A organização na nuvem permite centralizar tudo em um único lugar.
            </p>

            <p>
              Além de facilitar o acesso, manter arquivos organizados online
              ajuda a reduzir perdas de documentos e melhora a produtividade no
              trabalho e nos estudos.
            </p>
          </div>
        </section>

        <section className="landing-section card">
          <div className="section-title-block">
            <h2>1. Separe arquivos por pastas</h2>
          </div>

          <div className="landing-rich-text">
            <p>
              A forma mais simples de organizar arquivos é separar conteúdos por
              categorias. Por exemplo:
            </p>

            <ul>
              <li>Documentos pessoais</li>
              <li>Materiais de estudo</li>
              <li>Arquivos de trabalho</li>
              <li>Contratos e comprovantes</li>
            </ul>

            <p>
              Criar uma estrutura clara de pastas facilita encontrar qualquer
              arquivo rapidamente.
            </p>
          </div>
        </section>

        <section className="landing-section card">
          <div className="section-title-block">
            <h2>2. Use nomes de arquivos claros</h2>
          </div>

          <div className="landing-rich-text">
            <p>
              Dar nomes claros aos arquivos ajuda muito na organização. Em vez
              de usar nomes genéricos como <strong>documento1.pdf</strong>,
              prefira algo mais descritivo:
            </p>

            <ul>
              <li>contrato-cliente-2026.pdf</li>
              <li>comprovante-aluguel-janeiro.pdf</li>
              <li>planejamento-estudos-2026.pdf</li>
            </ul>
          </div>
        </section>

        <section className="landing-section card">
          <div className="section-title-block">
            <h2>3. Centralize seus arquivos</h2>
          </div>

          <div className="landing-rich-text">
            <p>
              Uma das maiores dificuldades na organização digital é ter arquivos
              espalhados em muitos lugares diferentes. Centralizar tudo em uma
              única plataforma ajuda a manter controle e clareza.
            </p>

            <p>
              Plataformas de armazenamento na nuvem permitem acessar documentos
              rapidamente e manter uma estrutura organizada de pastas e arquivos.
            </p>
          </div>
        </section>

        <section className="landing-section card">
          <div className="section-title-block">
            <h2>Como o Arquivapp pode ajudar</h2>
          </div>

          <div className="landing-feature-grid">
            <div className="landing-feature-card">
              <h3>Organização por pastas</h3>
              <p>
                Crie estruturas simples para separar documentos importantes.
              </p>
            </div>

            <div className="landing-feature-card">
              <h3>Upload rápido</h3>
              <p>
                Envie arquivos diretamente para sua conta e mantenha tudo
                centralizado.
              </p>
            </div>

            <div className="landing-feature-card">
              <h3>Visualização fácil</h3>
              <p>
                Consulte arquivos sempre que precisar sem complicação.
              </p>
            </div>
          </div>
        </section>

        <section className="landing-cta card">
          <div>
            <h2>Comece a organizar seus arquivos hoje</h2>

            <p className="muted">
              Crie uma conta gratuita no Arquivapp e mantenha seus arquivos
              organizados na nuvem com mais facilidade.
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