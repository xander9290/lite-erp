"use client";

import { useState, useEffect } from "react";
import { Alert } from "react-bootstrap";

export function ServerStatusBanner() {
  const [isServerDown, setIsServerDown] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    const checkServer = async () => {
      try {
        const res = await fetch("/api/health", { cache: "no-store" });
        if (!res.ok) throw new Error();
        if (isServerDown) setIsServerDown(false); // Recuperado
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
      } catch {
        if (!isServerDown) {
          setIsServerDown(true);
          // Solo iniciar polling si está caído
          interval = setInterval(checkServer, 5000);
        }
      }
    };

    // Chequeo inicial
    checkServer();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isServerDown]);

  if (!isServerDown) return null;

  return (
    <Alert variant="danger" className="text-center m-0">
      🚨 Servidor no disponible. Reconectando...
    </Alert>
  );
}
