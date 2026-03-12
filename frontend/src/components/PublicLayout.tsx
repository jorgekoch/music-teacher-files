import type { ReactNode } from "react";
import { PublicHeader } from "./PublicHeader";
import { PublicFooter } from "./PublicFooter";

type PublicLayoutProps = {
  children: ReactNode;
};

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="public-page">
      <div className="public-shell">
        <PublicHeader />
        <main className="public-main">{children}</main>
        <PublicFooter />
      </div>
    </div>
  );
}