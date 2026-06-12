"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useOverlays } from "@/shared/lib";

interface PolicyLinkProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

// Кнопка-ссылка, открывающая модалку «Политика конфиденциальности».
// Стили наследует от родителя через className (выглядит как обычная ссылка).
export function PolicyLink({ children, type: _type, ...rest }: PolicyLinkProps) {
  const { openPolicy } = useOverlays();
  return (
    <button type="button" onClick={openPolicy} {...rest}>
      {children}
    </button>
  );
}
