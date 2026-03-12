import { PublicLayout } from "../components/PublicLayout";

export function TermsPage() {
  return (
    <PublicLayout>
      <section className="institutional-page">
        <div className="institutional-page__header">
          <p className="eyebrow">Legal</p>
          <h1 className="institutional-page__title">Termos de uso</h1>
          <p className="institutional-page__description">
            Estas condições regulam o uso da plataforma Arquivapp.
          </p>
        </div>

        <div className="institutional-page__content card">
          <p>
            Ao utilizar o Arquivapp, o usuário concorda com as regras de uso da
            plataforma, limitações técnicas, responsabilidades de acesso e
            políticas aplicáveis ao serviço.
          </p>

          <p>
            O usuário é responsável por manter suas credenciais seguras e por
            utilizar a plataforma de forma lícita e adequada.
          </p>

          <p>
            Esta é uma versão inicial dos termos. No futuro, vale transformar
            este conteúdo em uma versão jurídica mais completa.
          </p>
        </div>
      </section>
    </PublicLayout>
  );
}