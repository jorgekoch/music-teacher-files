import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { BrandLogo } from "../components/BrandLogo";

export function RegisterPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isAuthLoading } = useAuth();

  const [form, setForm] = useState({
    name: "",
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
      await api.post("/users/register", form);
      toast.success("Usuário criado com sucesso.");
      navigate("/login");
    } catch (err: any) {
      const message = err?.response?.data?.error || "Erro ao criar usuário";
      setError(message);
      toast.error(message);
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
              Crie sua conta e centralize seus arquivos em um só lugar.
            </h1>

            <p className="auth-brand-description">
              Organize documentos, PDFs e arquivos importantes com segurança,
              praticidade e acesso simples.
            </p>
          </div>
        </section>

        <section className="auth-panel auth-panel--form">
          <div className="auth-card card">
            <div className="auth-header">
              <BrandLogo variant="dashboard" />
            </div>

            <h1 className="auth-title">Criar conta</h1>
            <p className="muted auth-subtitle">Crie seu acesso ao sistema.</p>

            <form className="auth-form" onSubmit={handleSubmit}>
              <input
                className="input"
                type="text"
                placeholder="Nome de usuário"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />

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
                {loading ? "Criando..." : "Criar conta"}
              </button>
            </form>

            <p className="muted auth-link-text">
              Já possui conta?{" "}
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