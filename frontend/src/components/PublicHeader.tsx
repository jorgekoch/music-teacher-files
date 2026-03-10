import { Link } from "react-router-dom";
import { BrandLogo } from "./BrandLogo";

export function PublicHeader() {
  return (
    <header className="public-header">
      <div className="public-header__brand">
        <BrandLogo variant="public" />
      </div>

      <nav className="public-nav">
        <Link to="/login" className="ghost-button">
          Entrar
        </Link>

        <Link to="/register" className="primary-button">
          Criar conta grátis
        </Link>
      </nav>
    </header>
  );
}