import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../services/api";

type ResetPasswordResponse = {
  message: string;
};

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post<ResetPasswordResponse>(
        "/auth/reset-password",
        {
          token,
          password: form.password,
          confirmPassword: form.confirmPassword,
        }
      );

      toast.success(response.data.message);
      navigate("/login");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.error || "Não foi possível redefinir a senha."
      );
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-card card">
          <p className="eyebrow">Arquivapp</p>
          <h1>Link inválido</h1>
          <p className="muted">
            O link de redefinição é inválido ou está incompleto.
          </p>

          <p className="muted auth-link-text">
            Solicite um novo link em{" "}
            <Link to="/forgot-password" className="auth-link-highlight">
              Esqueci minha senha
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <p className="eyebrow">Arquivapp</p>
        <h1>Nova senha</h1>
        <p className="muted">Digite sua nova senha para acessar o sistema.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            className="input"
            type="password"
            placeholder="Nova senha"
            value={form.password}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, password: e.target.value }))
            }
            required
          />

          <input
            className="input"
            type="password"
            placeholder="Confirmar nova senha"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
            required
          />

          <button className="primary-button full-width" disabled={loading}>
            {loading ? "Salvando..." : "Salvar nova senha"}
          </button>
        </form>
      </div>
    </div>
  );
}