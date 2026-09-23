import { Illustration } from "@/lib/actualite/types";

export default function Cartoon({
  illustration,
  priority = false,
  compact = false,
}: {
  illustration: Illustration;
  priority?: boolean;
  compact?: boolean;
}) {
  return (
    <figure className={compact ? "" : "my-10"}>
      <div className="border border-noir/15 bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={illustration.src}
          alt={illustration.alt}
          width={1536}
          height={1024}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          className="w-full h-auto block"
        />
      </div>
      {!compact && (
        <figcaption className="mt-3 flex gap-3 items-baseline">
          <span className="text-[0.65rem] tracking-[0.25em] uppercase text-or-text whitespace-nowrap">
            Le dessin de Jubël
          </span>
          <span className="font-serif italic text-noir/85">
            {illustration.legende}
          </span>
        </figcaption>
      )}
    </figure>
  );
}
