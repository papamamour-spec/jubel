import Newsletter from "./Newsletter";

export default function Footer() {
  return (
    <footer className="border-t border-noir/5 mt-24">
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-8">
        <div className="max-w-sm mb-10">
          <Newsletter />
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-noir/40 border-t border-noir/5 pt-6">
          <span>Institut Jubël, Dakar, Sénégal</span>
          <span>{new Date().getFullYear()}</span>
          <a
            href="mailto:contact@jubel.sn"
            className="hover:text-or transition-colors"
          >
            contact@jubel.sn
          </a>
        </div>
      </div>
    </footer>
  );
}
