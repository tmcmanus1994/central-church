import { Button } from "@/components/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-[720px] flex-col items-start gap-5 px-5 py-20 lg:py-32">
      <span className="text-xs font-bold tracking-[.14em] uppercase text-primary">
        404
      </span>
      <h1 className="m-0 font-display text-[36px] leading-[1.02] tracking-[-.035em] lg:text-[56px]">
        We couldn&rsquo;t find that page
      </h1>
      <p className="m-0 text-base leading-[1.65] text-body lg:text-[19px]">
        The page may have moved in the redesign. The homepage or the events
        calendar is a good place to start — or just come see us Sunday at
        10:15.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button href="/">Back home</Button>
        <Button href="/events" variant="outline">
          See events
        </Button>
      </div>
    </div>
  );
}
