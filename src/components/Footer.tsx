import Link from "next/link";
import Newsletter from "./Newsletter";
import VisitCounter from "./VisitCounter";
import { CONTACT_EMAIL } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-noir/10 mt-32">
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          <div className="max-w-sm">
            <Newsletter />
          </div>
          <div className="text-sm text-noir/75 md:text-right">
            <p className="font-serif text-lg mb-2">Un texte à proposer ?</p>
            <p className="mb-3">Jubël publie des contributions de lecteurs, relues avant parution.</p>
            <Link href="/contribuer" className="border border-noir/30 px-5 py-2 text-sm inline-block hover:border-or-text hover:text-or-text">
              Contribuer
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6 text-sm text-noir/70 border-t border-noir/10 pt-10">
          <span>
            Institut Jubël, Dakar, Sénégal
            <VisitCounter variant="total" className="block text-xs text-noir/60 mt-1" />
          </span>
          <nav aria-label="Liens de bas de page" className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/revue/methodologie" className="hover:text-or-text">
              Méthodologie
            </Link>
            <Link href="/charte-du-dessin" className="hover:text-or-text">
              Charte du dessin
            </Link>
            <Link href="/charte-des-commentaires" className="hover:text-or-text">
              Charte des commentaires
            </Link>
            <Link href="/contributions" className="hover:text-or-text">
              Contributions
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
