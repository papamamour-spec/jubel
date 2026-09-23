"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/actualite", label: "Actualité" },
  { href: "/revue", label: "Revue du Jour" },
  { href: "/dossiers", label: "Dossiers" },
  { href: "/bibliotheque", label: "Bibliothèque" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === "/revue") {
    return pathname === "/revue" || pathname.startsWith("/revue/");
  }
  if (href === "/dossiers") {
    return (
      pathname.startsWith("/dossiers") ||
      pathname.startsWith("/carnets") ||
      pathname.startsWith("/revue-mensuelle")
    );
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="border-b border-noir/10">
      <nav
        aria-label="Navigation principale"
        className="max-w-6xl mx-auto px-6"
      >
        <div className="py-5 flex items-center justify-between">
          <Link
            href="/"
            className="font-serif text-2xl tracking-wide hover:text-or-text"
          >
            Jubël
          </Link>
          <ul className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`text-sm tracking-wide ${
                      active ? "text-or-text" : "text-noir/70 hover:text-noir"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <button
            ref={buttonRef}
            type="button"
            className="md:hidden text-noir p-1 -mr-1"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((v) => !v)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
              aria-hidden="true"
              focusable="false"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 9h16.5m-16.5 6.75h16.5"
                />
              )}
            </svg>
          </button>
        </div>
        <ul
          id="menu-mobile"
          hidden={!open}
          className="md:hidden border-t border-noir/10 py-6 space-y-4"
        >
          {navLinks.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`block text-sm tracking-wide py-1 ${
                    active ? "text-or-text" : "text-noir/70"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
