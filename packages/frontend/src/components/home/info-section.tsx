const fallbackContent = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.`;

export function InfoSection({ content }: { content?: string }) {
  const text = content || fallbackContent;
  const paragraphs = text.split(/\n\s*\n/).filter(Boolean);

  return (
    <section id="info" className="py-16">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="text-sm leading-relaxed">
          {paragraphs
            .filter((_, i) => i % 2 === 0)
            .map((p) => (
              <p key={p.slice(0, 40)} className="mt-4 first:mt-0">
                {p.trim()}
              </p>
            ))}
        </div>
        <div className="text-sm leading-relaxed">
          {paragraphs
            .filter((_, i) => i % 2 === 1)
            .map((p) => (
              <p key={p.slice(0, 40)} className="mt-4 first:mt-0">
                {p.trim()}
              </p>
            ))}
        </div>
      </div>
    </section>
  );
}
