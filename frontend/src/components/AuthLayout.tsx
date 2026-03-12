import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function AuthLayout({ children }: Props) {
  return (
    <div className="auth-page">
      {children}
    </div>
  );
}