"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { isLiveWindow } from "@/components/LiveNowBadge";
import { youtubeLiveUrl } from "@/lib/site";

/**
 * During the live window this jumps straight to YouTube — someone tapping
 * "Watch Live" while it's actually live shouldn't land on a page whose only
 * job is another "Watch on YouTube" button. Outside the window it goes to
 * /media/live as usual, since there's no stream to jump straight into.
 */
export function WatchLiveButton() {
  const [live, setLive] = useState(false);

  useEffect(() => {
    const check = () => setLive(isLiveWindow(new Date()));
    check();
    const id = setInterval(check, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <Button href={live ? youtubeLiveUrl : "/media/live"} variant="outline-light">
      Watch Live
    </Button>
  );
}
