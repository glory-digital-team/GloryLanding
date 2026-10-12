import type { MouseEventHandler } from "react";
import { Button } from "@/shared/ui/Button";
import { siteConfig } from "@/shared/config";

interface CabinetLinkProps {
  /** Посетитель уже вошёл в кабинет — «Личный кабинет» вместо «Войти». */
  signedIn: boolean;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

/** Вход в личный кабинет клиента: «Войти» или «Личный кабинет», если уже вошёл. */
export function CabinetLink({ signedIn, className, onClick }: CabinetLinkProps) {
  return (
    <Button
      variant="secondary"
      size="md"
      calm
      href={siteConfig.cabinet.href}
      className={className}
      onClick={onClick}
    >
      {signedIn ? "Личный кабинет" : "Войти"}
    </Button>
  );
}
