import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Bulletin Automation — Data Access",
  description:
    "What the church's weekly bulletin automation accesses via the Gmail API, and how that data is used.",
};

export default function AutomationPrivacyPage() {
  return (
    <div className="mx-auto max-w-[720px] px-5 py-8 lg:py-16">
      <span className="text-xs font-bold tracking-[.14em] uppercase text-primary">
        Bulletin Automation
      </span>
      <h1 className="mt-2.5 mb-6 font-display text-[32px] leading-[1.06] tracking-[-.03em] lg:text-[44px] lg:tracking-[-.035em]">
        Data Access &amp; Privacy Notice
      </h1>

      <div className="flex flex-col gap-5 text-base leading-[1.7] text-body lg:text-[17px]">
        <p className="m-0">
          Central Church of Christ runs a small internal automation that keeps
          the weekly bulletin, event listings, and prayer page on this website
          up to date. This page explains exactly what that automation
          accesses and why.
        </p>

        <p className="m-0">
          <strong className="text-ink">What it accesses.</strong> The
          automation has read-only access (the <code>gmail.readonly</code>{" "}
          scope) to a single, dedicated Gmail mailbox that exists only to
          receive the church office&rsquo;s weekly bulletin email. It does not
          access, and has never requested access to, any personal Google
          account — including anyone at Central who happens to use Gmail.
        </p>

        <p className="m-0">
          <strong className="text-ink">What it&rsquo;s used for.</strong> Once
          a week, the automation searches that one mailbox for the bulletin
          email, reads its contents, and uses them to update the public{" "}
          <code>/bulletin</code>, <code>/hub</code>, and <code>/events</code>{" "}
          pages on arcentralchurch.org. A human on staff reviews every change
          before it goes live — nothing is published automatically without
          that review.
        </p>

        <p className="m-0">
          <strong className="text-ink">What isn&rsquo;t published.</strong>{" "}
          Named prayer requests, health or bereavement details, wedding and
          baby showers, personal phone numbers and email addresses, and
          giving figures are deliberately kept off this public website even
          though they may appear in the source email — that filtering
          happens as part of the same review.
        </p>

        <p className="m-0">
          <strong className="text-ink">Data handling.</strong> Nothing from
          the mailbox is shared with any third party, sold, or used for
          advertising. The email content is read for the length of one
          automated run and is not retained afterward — the only lasting
          output is the already-public bulletin content described above.
        </p>

        <p className="m-0">
          Questions about this process are welcome —{" "}
          <a
            href={`mailto:${site.email}`}
            className="font-semibold text-primary no-underline hover:text-primary-deep"
          >
            {site.email}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
