import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../services/api";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post("/auth/forgot-password", { email });

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
      <div className="auth-card card">
        <p className="eyebrow">Arquivapp</p>
        <h1>Recuperar senha</h1>
        <p className="muted">
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
      </div>
    </div>
  );
}