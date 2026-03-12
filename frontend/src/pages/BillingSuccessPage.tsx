import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BrandLogo } from "../components/BrandLogo";
import { getCheckoutSessionStatus } from "../services/billingService";
import { AuthLayout } from "../components/AuthLayout";

type SessionState = {
  loading: boolean;
  error: string;
  paymentStatus: string | null;
  status: string | null;
};

export function BillingSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id") || "";

  const [sessionState, setSessionState] = useState<SessionState>({
    loading: true,
    error: "",
    paymentStatus: null,
    status: null,
  });

  useEffect(() => {
    let isCancelled = false;

    async function loadSession() {
      if (!sessionId) {
        setSessionState({
          loading: false,
          error: "Sessão de pagamento não encontrada.",
          paymentStatus: null,
          status: null,
        });
        return;
      }

      try {
        const result = await getCheckoutSessionStatus(sessionId);

        if (isCancelled) return;

        setSessionState({
          loading: false,
          error: "",
          paymentStatus: result.paymentStatus,
          status: result.status,
        });
      } catch {
        if (isCancelled) return;

        setSessionState({
          loading: false,
          error:
            "Não foi possível confirmar o pagamento agora. Seu plano pode levar alguns instantes para ser atualizado.",
          paymentStatus: null,
          status: null,
        });
      }
    }

    void loadSession();

    return () => {
      isCancelled = true;
    };
  }, [sessionId]);

  function getTitle() {
    if (sessionState.loading) return "Confirmando pagamento";
    if (sessionState.error) return "Pagamento recebido";
    if (sessionState.paymentStatus === "paid") return "Pagamento confirmado";
    return "Pagamento em processamento";
  }

  function getDescription() {
    if (sessionState.loading) {
      return "Estamos validando sua sessão de pagamento e atualizando seu plano.";
    }

    if (sessionState.error) {
      return sessionState.error;
    }

    if (sessionState.paymentStatus === "paid") {
      return "Seu pagamento foi confirmado com sucesso. Seu plano PRO já deve estar disponível no dashboard.";
    }

    return "Seu pagamento está em processamento. Aguarde alguns instantes e volte ao dashboard para acompanhar a atualização do plano.";
  }

  return (
    <AuthLayout>
      <section className="public-auth-page">
        <div className="public-auth-page__header">
          <BrandLogo variant="public" />
          <p className="eyebrow">Assinatura</p>
          <h1 className="public-auth-page__title">{getTitle()}</h1>
          <p className="public-auth-page__description">{getDescription()}</p>
        </div>

        <div className="public-auth-card public-auth-card--wide card">
          <div className="auth-header">
            <BrandLogo variant="dashboard" />
          </div>

          <h1 className="auth-title">{getTitle()}</h1>
          <p className="muted auth-subtitle">{getDescription()}</p>

          {sessionState.loading && (
            <div className="billing-status-box billing-status-box--info">
              <strong>Verificando a sessão...</strong>
              <p className="muted">
                Isso pode levar alguns segundos após o retorno do checkout.
              </p>
            </div>
          )}

          {!sessionState.loading && sessionState.paymentStatus === "paid" && (
            <div className="billing-status-box billing-status-box--success">
              <strong>Plano PRO confirmado</strong>
              <p>
                Acesse seu dashboard para verificar o novo limite de armazenamento e os recursos liberados.
              </p>
            </div>
          )}

          {!sessionState.loading &&
            !sessionState.error &&
            sessionState.paymentStatus !== "paid" && (
              <div className="billing-status-box billing-status-box--warning">
                <strong>Pagamento em processamento</strong>
                <p>
                  Seu plano pode levar alguns instantes para refletir no sistema.
                </p>
              </div>
            )}

          {!sessionState.loading && sessionState.error && (
            <div className="billing-status-box billing-status-box--warning">
              <strong>Confirmação ainda não concluída</strong>
              <p>{sessionState.error}</p>
            </div>
          )}

          <div className="auth-form">
            <Link to="/dashboard" className="primary-button full-width">
              Ir para o dashboard
            </Link>

            <Link to="/" className="ghost-button full-width">
              Voltar para a página inicial
            </Link>
          </div>
        </div>
      </section>
    </AuthLayout>
  );
}