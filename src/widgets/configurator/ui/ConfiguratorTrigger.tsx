"use client";

import type { ReactNode } from "react";
import { useOverlays } from "@/shared/lib";
import { Button, type ButtonSize, type ButtonVariant } from "@/shared/ui/Button";

interface ConfiguratorTriggerProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  calm?: boolean;
  className?: string;
  children: ReactNode;
}

// Кнопка, открывающая модальный конфигуратор — клиентский «лист»,
// чтобы серверные секции (CTA-блок и др.) не становились клиентскими.
export function ConfiguratorTrigger(props: ConfiguratorTriggerProps) {
  const { openConfigurator } = useOverlays();
  return <Button {...props} type="button" onClick={openConfigurator} />;
}
