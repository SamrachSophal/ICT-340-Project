"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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

  // Keep the search box in sync with ?q= on the stories page.
  useEffect(() => {
    setValue(searchParams.get("q") || "");
  }, [searchParams]);

  useEffect(() => () => clearTimeout(timer.current), []);

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
        </div>
      </div>
    </header>
  );
}