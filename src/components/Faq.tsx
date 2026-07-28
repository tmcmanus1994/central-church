/** Accessible accordion built on <details>/<summary> — works without JS. */
export function Faq({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white">
      {items.map((item, i) => (
        <details key={item.question} className="faq group border-b border-line last:border-0" open={i === 0}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 p-[18px] lg:px-7 lg:py-[26px]">
            <h3 className="m-0 font-display text-[17px] tracking-[-.01em] lg:text-[21px] lg:tracking-[-.015em]">
              {item.question}
            </h3>
            <span aria-hidden className="faq-icon shrink-0 text-[22px] leading-none text-primary" />
          </summary>
          <p className="m-0 max-w-[640px] px-[18px] pb-[18px] text-[15px] leading-[1.65] text-body text-pretty-wrap lg:px-7 lg:pb-[26px] lg:text-[16.5px]">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
