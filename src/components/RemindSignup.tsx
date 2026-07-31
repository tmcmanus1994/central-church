import { remindJoinUrl, remindSmsHref } from "@/lib/remind";
import { Button } from "./Button";

/**
 * Drop-in Remind signup: a join-link button plus the text-to-join
 * instructions, for anywhere alert signup appears (ministry pages, footer,
 * Plan a Visit). Renders nothing for a class that isn't set up yet, so an
 * empty code in remind.ts never produces a broken button.
 */
export function RemindSignup({
  code,
  variant = "primary",
  className = "",
}: {
  code: string;
  variant?: "primary" | "outline" | "white";
  className?: string;
}) {
  if (!code) return null;

  return (
    <div className={`flex flex-col items-start gap-2.5 ${className}`}>
      <Button href={remindJoinUrl(code)} variant={variant} size="md">
        Get Text Alerts
      </Button>
      <p className="m-0 text-[14px] leading-[1.5] text-current opacity-80">
        or text <span className="font-bold">@{code}</span> to{" "}
        <a href={remindSmsHref(code)} className="font-bold underline underline-offset-2">
          81010
        </a>
      </p>
    </div>
  );
}
