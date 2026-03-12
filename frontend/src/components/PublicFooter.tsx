import { Link } from "react-router-dom";

export function PublicFooter() {
  return (
    <footer className="public-footer">
      <div className="public-footer__container">
        <div className="public-footer__brand">
          <h3 className="public-footer__logo">Arquivapp</h3>
          <p className="public-footer__description">
            Armazene, organize e visualize seus arquivos com simplicidade,
            rapidez e segurança, direto no navegador.
          </p>
        </div>

        <div className="public-footer__column">
          <h4>Produto</h4>
          <Link to="/">Início</Link>
          <Link to="/register">Criar conta</Link>
          <Link to="/login">Entrar</Link>
        </div>

        <div className="public-footer__column">
          <h4>Empresa</h4>
          <Link to="/about">Sobre</Link>
          <Link to="/contact">Contato</Link>
        </div>

        <div className="public-footer__column">
          <h4>Legal</h4>
          <Link to="/terms">Termos de uso</Link>
          <Link to="/privacy">Privacidade</Link>
        </div>
      </div>

      <div className="public-footer__bottom">
        <p>© {new Date().getFullYear()} Arquivapp. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}