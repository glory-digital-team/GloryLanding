"use client";

import { useEffect } from "react";
import { useOverlays } from "@/shared/lib";

export function ConfigAutoOpen() {
  const { openConfigurator } = useOverlays();

  useEffect(() => {
    openConfigurator();
  }, [openConfigurator]);

  return null;
}
