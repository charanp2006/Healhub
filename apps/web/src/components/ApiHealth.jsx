"use client";

import axios from "axios";
import { useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "@/src/context/AppContext";

const HEALTH_URL = "/api/health";
const CHECK_INTERVAL = 30_000;

const ApiHealth = () => {
  const { backendURL } = useContext(AppContext);
  const [status, setStatus] = useState("checking"); // checking | up | down

  const check = useCallback(async () => {
    setStatus("checking");
    try {
      const { data } = await axios.get(`${backendURL}${HEALTH_URL}`, {
        timeout: 8000,
      });
      setStatus(data?.success ? "up" : "down");
    } catch {
      setStatus("down");
    }
  }, [backendURL]);

  useEffect(() => {
    check();
    const id = setInterval(check, CHECK_INTERVAL);
    return () => clearInterval(id);
  }, [check]);

  const states = {
    checking: { dot: "bg-yellow-400", label: "Checking API…" },
    up: { dot: "bg-green-500", label: "API running" },
    down: { dot: "bg-red-500", label: "API offline" },
  };

  const { dot, label } = states[status];

  return (
    <button
      type="button"
      onClick={check}
      title="Check API status"
      className="fixed z-30 bottom-16 left-4 md:bottom-6 md:left-6 inline-flex items-center gap-2 rounded-full border border-border bg-background-card px-3 py-1.5 text-xs font-medium text-text-secondary shadow-md transition-colors hover:bg-background-muted"
    >
      <span className="relative flex h-2 w-2">
        {status === "up" && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
        )}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${dot}`} />
      </span>
      {label}
    </button>
  );
};

export default ApiHealth;