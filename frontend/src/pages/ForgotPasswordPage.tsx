import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../services/api";
import { BrandLogo } from "../components/BrandLogo";

type ForgotPasswordResponse = {
  message: string;
};

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post<ForgotPasswordResponse>(
        "/auth/forgot-password",
        { email }
      );

      toast.success(response.data.message);
      setEmail("");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.error ||
          "Não foi possível processar sua solicitação."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <section className="auth-panel auth-panel--brand">
          <div className="auth-brand-content">
            <BrandLogo variant="public" />

            <p className="auth-eyebrow">Arquivapp</p>

            <h1 className="auth-brand-title">
              Recupere o acesso à sua conta com rapidez e segurança.
            </h1>

            <p className="auth-brand-description">
              Informe seu e-mail para receber um link de redefinição e voltar a
              acessar seus arquivos com tranquilidade.
            </p>
          </div>
        </section>

        <section className="auth-panel auth-panel--form">
          <div className="auth-card card">
            <div className="auth-header">
              <BrandLogo variant="dashboard" />
            </div>

            <h1 className="auth-title">Recuperar senha</h1>
            <p className="muted auth-subtitle">
              Informe seu e-mail para receber um link de redefinição.
            </p>

            <form className="auth-form" onSubmit={handleSubmit}>
              <input
                className="input"
                type="email"
                placeholder="Seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button className="primary-button full-width" disabled={loading}>
                {loading ? "Enviando..." : "Enviar link de recuperação"}
              </button>
            </form>

            <p className="muted auth-link-text">
              Lembrou sua senha?{" "}
              <Link to="/login" className="auth-link-highlight">
                Entrar
              </Link>
            </p>

            <Link to="/" className="auth-back-link">
              ← Voltar para a página inicial
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}