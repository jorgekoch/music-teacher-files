import { PublicLayout } from "../components/PublicLayout";

export function AboutPage() {
  return (
    <PublicLayout>
      <section className="institutional-page">
        <div className="institutional-page__header">
          <p className="eyebrow">Sobre</p>
          <h1 className="institutional-page__title">Sobre o Arquivapp</h1>
          <p className="institutional-page__description">
            O Arquivapp é uma plataforma criada para armazenar, organizar e
            visualizar arquivos de forma simples, rápida e segura diretamente no
            navegador.
          </p>
        </div>

        <div className="institutional-page__content card">
          <p>
            Nossa proposta é oferecer uma experiência prática para quem precisa
            guardar documentos, materiais de estudo e arquivos importantes sem
            complicação.
          </p>

          <p>
            O produto foi pensado para unir organização clara, navegação rápida e
            visualização de arquivos em um só lugar.
          </p>

          <p>
            O Arquivapp está em evolução constante, com foco em usabilidade,
            segurança e recursos que realmente façam diferença no dia a dia.
          </p>
        </div>
      </section>
    </PublicLayout>
  );
}