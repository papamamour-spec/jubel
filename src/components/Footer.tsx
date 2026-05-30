import Newsletter from "./Newsletter";

export default function Footer() {
  return (
    <footer className="border-t border-noir/5 mt-32">
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-12">
        <div className="max-w-sm mb-16">
          <Newsletter />
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6 text-sm text-noir/40 border-t border-noir/5 pt-10">
          <span>Institut Jubël, Dakar, Sénégal</span>
          <a
            href="mailto:contact@jubel.sn"
            className="hover:text-or transition-colors"
          >
            contact@jubel.sn
          </a>
          <span>{new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
