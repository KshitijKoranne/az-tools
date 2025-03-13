import { CSSProperties } from "react";

// Self-contained component that can be copied to other projects
// Requirements:
// - Tailwind CSS for the utility classes
export default function AnimatedOutlinedBlock({
  children,
  className = "",
  background = "30 41 59",
  highlight = "255 255 255",
}: {
  children: React.ReactNode;
  className?: string;
  background?: string;
  highlight?: string;
}) {
  return (
    <div
      style={
        {
          "--background": background,
          "--highlight": highlight,

          "--bg-color":
            "linear-gradient(rgb(var(--background)), rgb(var(--background)))",
          "--border-color": `linear-gradient(145deg,
              rgb(var(--highlight)) 0%,
              rgb(var(--highlight) / 0.3) 33.33%,
              rgb(var(--highlight) / 0.14) 66.67%,
              rgb(var(--highlight) / 0.1) 100%)
            `,
        } as CSSProperties
      }
      className={`flex rounded-xl border border-transparent p-8 text-center
      [background:padding-box_var(--bg-color),border-box_var(--border-color)] ${className}`}
    >
      {children}
    </div>
  );
}
