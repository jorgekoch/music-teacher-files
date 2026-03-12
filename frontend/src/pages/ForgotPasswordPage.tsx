import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../services/api";
import { BrandLogo } from "../components/BrandLogo";
import { AuthLayout } from "../components/AuthLayout";

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
    <AuthLayout>
      <section className="public-auth-page">
        <div className="public-auth-page__header">
          <BrandLogo variant="public" />
          <p className="eyebrow">Recuperação</p>
          <h1 className="public-auth-page__title">Esqueceu sua senha?</h1>
          <p className="public-auth-page__description">
            Informe seu e-mail para receber um link de redefinição e voltar a acessar seus arquivos com tranquilidade.
          </p>
        </div>

        <div className="public-auth-card card">
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
    </AuthLayout>
  );
}