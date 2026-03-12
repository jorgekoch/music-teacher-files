import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { BrandLogo } from "../components/BrandLogo";
import { AuthLayout } from "../components/AuthLayout";

export function LoginPage() {
  const { login, isAuthenticated, isAuthLoading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isAuthLoading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      await login(form);
      navigate("/dashboard");
    } catch (err: any) {
      const message = err?.response?.data?.error || "Erro ao fazer login";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <section className="public-auth-page">
        <div className="public-auth-page__header">
          <BrandLogo variant="public" />
          <p className="eyebrow">Acesso</p>
          <h1 className="public-auth-page__title">Entrar na sua conta</h1>
          <p className="public-auth-page__description">
            Acesse seu espaço no Arquivapp para organizar e visualizar seus arquivos com mais simplicidade e segurança.
          </p>
        </div>

        <div className="public-auth-card card">
          <div className="auth-header">
            <BrandLogo variant="dashboard" />
          </div>

          <h1 className="auth-title">Entrar</h1>
          <p className="muted auth-subtitle">Acesse seu acervo privado.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <input
              className="input"
              type="email"
              placeholder="E-mail"
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
            />

            <input
              className="input"
              type="password"
              placeholder="Senha"
              value={form.password}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, password: e.target.value }))
              }
            />

            {error && <p className="feedback-inline-error">{error}</p>}

            <button className="primary-button full-width" disabled={loading}>
              {loading ? "Entrando e preparando seu painel..." : "Entrar"}
            </button>
          </form>

          <p className="auth-link-text">
            <Link to="/forgot-password" className="auth-link-highlight">
              Esqueci minha senha
            </Link>
          </p>

          <p className="muted auth-link-text">
            Não possui conta?{" "}
            <Link to="/register" className="auth-link-highlight">
              Criar usuário
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