import { PublicLayout } from "../components/PublicLayout";

export function ContactPage() {
  return (
    <PublicLayout>
      <section className="institutional-page">
        <div className="institutional-page__header">
          <p className="eyebrow">Contato</p>
          <h1 className="institutional-page__title">Fale com o Arquivapp</h1>
          <p className="institutional-page__description">
            Se tiver dúvidas, sugestões ou precisar de suporte, entre em contato.
          </p>
        </div>

        <div className="institutional-page__content card">
          <p>
            Email:{" "}
            <a className="institutional-link" href="mailto:contato@arquivapp.com.br">
              contato@arquivapp.com.br
            </a>
          </p>

          <p className="muted">
            Em breve, esta página também pode receber formulário de contato,
            canal de suporte e central de ajuda.
          </p>
        </div>
      </section>
    </PublicLayout>
  );
}