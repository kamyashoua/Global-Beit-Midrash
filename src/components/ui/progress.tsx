"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Simple accessible progress bar (0–100). */
const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value?: number | null }
>(({ className, value = 0, ...props }, ref) => (
  <div
    ref={ref}
    role="progressbar"
    aria-valuenow={value ?? 0}
    aria-valuemin={0}
    aria-valuemax={100}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-[var(--muted)]/50",
      className,
    )}
    {...props}
  >
    <div
      className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--primary)] transition-[width] duration-500 ease-out"
      style={{ width: `${Math.min(100, Math.max(0, value ?? 0))}%` }}
    />
  </div>
));
Progress.displayName = "Progress";

export { Progress };
