"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "kla-theme";

function getInitialTheme() {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(getInitialTheme());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme, mounted]);

  if (!mounted) {
    /* render an invisible placeholder of the same size to avoid layout shift */
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 36,
          height: 36,
        }}
        aria-hidden="true"
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 36,
        height: 36,
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-card)",
        backgroundColor: "var(--color-surface)",
        color: "var(--color-text-secondary)",
        cursor: "pointer",
        fontSize: "1.125rem",
        lineHeight: 1,
        transition: "var(--transition-base)",
      }}
      onPointerEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--color-accent)";
        e.currentTarget.style.color = "var(--color-accent)";
      }}
      onPointerLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--color-border)";
        e.currentTarget.style.color = "var(--color-text-secondary)";
      }}
      onFocus={(e) => {
        e.currentTarget.style.outline = "2px solid var(--color-focus)";
        e.currentTarget.style.outlineOffset = "2px";
      }}
      onBlur={(e) => {
        e.currentTarget.style.outline = "none";
      }}
    >
      {isDark ? "\u2600" : "\u263E"}
    </button>
  );
}