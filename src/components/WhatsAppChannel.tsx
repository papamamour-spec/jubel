import { WHATSAPP_CHANNEL_URL } from "@/lib/site";

export default function WhatsAppChannel({ className = "" }: { className?: string }) {
  if (!WHATSAPP_CHANNEL_URL) return null;
  return (
    <p className={`text-sm text-noir/75 ${className}`}>
      Recevez la Revue du Jour chaque matin sur WhatsApp :{" "}
      <a
        href={WHATSAPP_CHANNEL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-or-text underline underline-offset-4 hover:text-noir"
      >
        suivre la chaîne Jubël<span className="sr-only"> (nouvelle fenêtre)</span>
      </a>
      .
    </p>
  );
}
