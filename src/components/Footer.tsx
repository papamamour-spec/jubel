import Link from "next/link";
import Newsletter from "./Newsletter";
import { CONTACT_EMAIL } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-noir/10 mt-32">
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-12">
        <div className="max-w-sm mb-16">
          <Newsletter />
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6 text-sm text-noir/70 border-t border-noir/10 pt-10">
          <span>Institut Jubël, Dakar, Sénégal</span>
          <nav aria-label="Liens de bas de page" className="flex gap-6">
            <Link href="/revue/methodologie" className="hover:text-or-text">
              Méthodologie
            </Link>
            <Link href="/charte-du-dessin" className="hover:text-or-text">
              Charte du dessin
            </Link>
            <a href="/feed.xml" className="hover:text-or-text">
              Flux RSS
            </a>
            <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-or-text">
              {CONTACT_EMAIL}
            </a>
          </nav>
          <span>{new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
