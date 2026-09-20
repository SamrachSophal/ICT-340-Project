"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createClient } from "../lib/supabase/browser.js";
import ThemeToggle from "./ThemeToggle.js";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/stories", label: "All Stories" },
];

export default function Nav() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState("");
  const timer = useRef(null);

  const [user, setUser] = useState(null);

  // Keep the search box in sync with ?q= on the stories page.
  useEffect(() => {
    setValue(searchParams.get("q") || "");
  }, [searchParams]);

  useEffect(() => () => clearTimeout(timer.current), []);

  // Track authentication state via Supabase.
  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
  };

  const go = (next) => {
    const q = next.trim();
    router.push(q ? `/stories?q=${encodeURIComponent(q)}` : "/stories");
  };

  const handleChange = (e) => {
    const v = e.target.value;
    setValue(v);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => go(v), 300);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    clearTimeout(timer.current);
    go(value);
  };

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link href="/" className="nav-brand">
          Khmer Living Archive
        </Link>

        <div className="nav-right">
          <nav className="nav-links" aria-label="Main navigation">
            {LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={"nav-link" + (active ? " active" : "")}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <form className="nav-form" onSubmit={handleSubmit} role="search">
            <input
              className="search-input nav-search"
              type="search"
              autoComplete="off"
              value={value}
              onChange={handleChange}
              placeholder="Search stories…"
              aria-label="Search stories by title"
            />
          </form>

          <ThemeToggle />

          {user ? (
            <div className="nav-links">
              <span
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "0.75rem",
                  letterSpacing: "0.08em",
                  color: "var(--color-text-primary)",
                  padding: "4px 0",
                }}
              >
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "0.75rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--color-text-muted)",
                  background: "none",
                  border: "none",
                  padding: "4px 0",
                  cursor: "pointer",
                  transition: "var(--transition-base)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--color-accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--color-text-muted)";
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <nav className="nav-links" aria-label="Account navigation">
              <Link href="/login" className="nav-link">
                Login
              </Link>
              <Link href="/signup" className="nav-link">
                Sign Up
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}