import { Link } from "react-router-dom";
import "../styles/brandLogo.css";

type BrandLogoProps = {
  variant?: "dashboard" | "public";
  withLink?: boolean;
  to?: string;
};

export function BrandLogo({
  variant = "dashboard",
  withLink = true,
  to = "/",
}: BrandLogoProps) {
  const logo = (
    <img
      src="/logo-arquivapp-transparent.png"
      alt="Arquivapp"
      className={`brand-logo brand-logo--${variant}`}
    />
  );

  if (!withLink) {
    return logo;
  }

  return (
    <Link to={to} className="brand-logo-link" aria-label="Ir para a página inicial">
      {logo}
    </Link>
  );
}