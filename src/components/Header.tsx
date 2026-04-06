"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/revue", label: "Revue" },
  { href: "/carnets", label: "Carnets" },
  { href: "/rencontres", label: "Rencontres" },
  { href: "/bibliotheque", label: "Bibliothèque" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-noir/5">
      <nav className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link
          href="/"
          className="font-serif text-2xl tracking-wide hover:text-or transition-colors"
        >
          Jubël
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm tracking-wide transition-colors ${
                pathname?.startsWith(link.href)
                  ? "text-or"
                  : "text-noir/60 hover:text-noir"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <button
          className="md:hidden text-noir/60"
          aria-label="Menu"
          onClick={() => {
            const menu = document.getElementById("mobile-menu");
            menu?.classList.toggle("hidden");
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 9h16.5m-16.5 6.75h16.5"
            />
          </svg>
        </button>
      </nav>
      <div id="mobile-menu" className="hidden md:hidden border-t border-noir/5 px-6 py-4 space-y-3">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block text-sm tracking-wide ${
              pathname?.startsWith(link.href)
                ? "text-or"
                : "text-noir/60"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
