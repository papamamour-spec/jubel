import { formatDateLong } from "@/lib/dates";
import TimeAgo from "./TimeAgo";
import VisitCounter from "./VisitCounter";

export default function Masthead({
  date,
  updatedAt,
  sourcesCount,
}: {
  date: string;
  updatedAt: string;
  sourcesCount: number;
}) {
  return (
    <div className="bg-noir text-cream">
      <div className="max-w-6xl mx-auto px-6 py-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-1 text-[0.7rem] tracking-[0.2em] uppercase">
        <span className="font-medium">Édition du {formatDateLong(date)}</span>
        <span className="flex gap-6 text-cream/75">
          <span>
            Mise à jour{" "}
            <TimeAgo iso={updatedAt} fallback={formatDateLong(updatedAt)} className="text-cream" />
          </span>
          {sourcesCount > 0 && <span>{sourcesCount} sources consultées</span>}
          <VisitCounter variant="today" className="text-cream" />
        </span>
      </div>
    </div>
  );
}
