import { PublicLayout } from "../components/PublicLayout";

export function PrivacyPage() {
  return (
    <PublicLayout>
      <section className="institutional-page">
        <div className="institutional-page__header">
          <p className="eyebrow">Legal</p>
          <h1 className="institutional-page__title">Política de privacidade</h1>
          <p className="institutional-page__description">
            Transparência sobre como os dados são utilizados dentro da plataforma.
          </p>
        </div>

        <div className="institutional-page__content card">
          <p>
            O Arquivapp coleta apenas os dados necessários para autenticação,
            funcionamento da plataforma, armazenamento de arquivos e suporte ao
            usuário.
          </p>

          <p>
            As informações são tratadas com foco em segurança, privacidade e
            melhoria contínua da experiência do produto.
          </p>

          <p>
            Com a evolução do SaaS, esta política pode ser expandida para cobrir
            com mais detalhes retenção de dados, provedores utilizados e direitos
            do usuário.
          </p>
        </div>
      </section>
    </PublicLayout>
  );
}