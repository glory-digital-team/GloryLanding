import type { MouseEventHandler } from "react";
import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui/Button";
import { Icon } from "@/shared/ui/Icon";
import { siteConfig } from "@/shared/config";
import styles from "./CabinetLink.module.scss";

interface CabinetLinkProps {
  /** Посетитель уже вошёл в кабинет — значок профиля вместо значка входа. */
  signedIn: boolean;
  /** Только значок (шапка); без него — значок с подписью (мобильное меню). */
  iconOnly?: boolean;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

/** Вход в личный кабинет клиента: значок входа или, если уже вошёл, значок профиля. */
export function CabinetLink({ signedIn, iconOnly, className, onClick }: CabinetLinkProps) {
  const label = signedIn ? "Личный кабинет" : "Войти";
  if (iconOnly) {
    return (
      <a
        href={siteConfig.cabinet.href}
        className={cn(styles.iconLink, className)}
        aria-label={label}
        title={label}
        onClick={onClick}
      >
        <Icon name={signedIn ? "user" : "log-in"} size={22} />
      </a>
    );
  }
  return (
    <Button
      variant="secondary"
      size="md"
      calm
      href={siteConfig.cabinet.href}
      iconLeft={signedIn ? "user" : "log-in"}
      className={className}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
