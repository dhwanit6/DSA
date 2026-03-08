import Link from "next/link";
import type { ChapterSupportPack } from "@/lib/chapter-support";

interface ChapterSupportPanelProps {
  support: ChapterSupportPack;
}

export function ChapterSupportPanel({ support }: ChapterSupportPanelProps) {
  return (
    <section data-testid="chapter-support-panel" className="mt-12 rounded-xl border border-border bg-surface-1 p-5 lg:p-6">
      <div className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-fg">Support Pack</p>
        <h2 className="mt-2 text-lg font-semibold text-foreground">{support.title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-fg">{support.summary}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-background/60 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-fg">Must Keep</p>
          <ol className="mt-3 space-y-2 text-sm text-foreground/90">
            {support.mustKnow.map((item, index) => (
              <li key={item}>
                {index + 1}. {item}
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-lg border border-border bg-background/60 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-fg">Rapid-Fire Check</p>
          <ol className="mt-3 space-y-2 text-sm text-foreground/90">
            {support.vivaQuestions.map((question, index) => (
              <li key={question}>
                {index + 1}. {question}
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-lg border border-border bg-background/60 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-fg">Mini Drill</p>
          <ol className="mt-3 space-y-2 text-sm text-foreground/90">
            {support.miniDrills.map((drill, index) => (
              <li key={drill}>
                {index + 1}. {drill}
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-lg border border-border bg-background/60 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-fg">Recovery Path</p>
          <div className="mt-3 space-y-3 text-sm text-foreground/90">
            {support.recoveryLinks.map((link, index) => (
              <p key={`${link.href}-${link.label}`}>
                {index + 1}.{" "}
                <Link href={link.href} className="text-primary hover:underline underline-offset-4">
                  {link.label}
                </Link>{" "}
                - {link.note}
              </p>
            ))}
          </div>
        </div>
      </div>

      {support.recommendedVideos.length > 0 && (
        <div className="mt-4 rounded-lg border border-border bg-background/60 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-fg">Community Picks</p>
          <div className="mt-3 space-y-3 text-sm text-foreground/90">
            {support.recommendedVideos.map((video, index) => (
              <p key={video.href}>
                {index + 1}.{" "}
                <a
                  href={video.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline underline-offset-4"
                >
                  {video.title}
                </a>{" "}
                - {video.note}
              </p>
            ))}
          </div>
          {support.sourceNote && <p className="mt-3 text-xs text-muted-fg">{support.sourceNote}</p>}
        </div>
      )}
    </section>
  );
}
