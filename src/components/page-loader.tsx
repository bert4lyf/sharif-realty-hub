import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { OFFICIAL_MEDIA } from "@/lib/media";

export function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  // Trigger brief loader on route changes and initial page load
  useEffect(() => {
    setIsLoading(true);
    setShouldRender(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
      const exitTimer = setTimeout(() => {
        setShouldRender(false);
      }, 400); // allow fade transition
      return () => clearTimeout(exitTimer);
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FAF8F5]/95 backdrop-blur-xl transition-opacity duration-400 ${
        isLoading ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      aria-hidden={!isLoading}
      aria-label="Loading page..."
    >
      <div className="relative flex flex-col items-center justify-center p-8">
        {/* Outer glowing halo */}
        <div className="absolute -inset-8 rounded-full bg-gradient-to-r from-[#C5A880]/20 via-[#B38B59]/15 to-[#C5A880]/20 blur-2xl animate-pulse pointer-events-none" />

        {/* Circular Luxury Spinner Ring */}
        <div className="relative size-44 sm:size-50 flex items-center justify-center">
          <svg
            className="absolute inset-0 size-full animate-spin"
            style={{ animationDuration: "7s" }}
            viewBox="0 0 100 100"
            fill="none"
          >
            <circle
              cx="50"
              cy="50"
              r="46"
              stroke="rgba(197, 168, 128, 0.15)"
              strokeWidth="2"
            />
            <circle
              cx="50"
              cy="50"
              r="46"
              stroke="#C5A880"
              strokeWidth="2"
              strokeDasharray="80 200"
              strokeLinecap="round"
            />
          </svg>

          {/* Secondary Arc */}
          <svg
            className="absolute inset-0 size-full animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "4s" }}
            viewBox="0 0 100 100"
            fill="none"
          >
            <circle
              cx="50"
              cy="50"
              r="41"
              stroke="rgba(15, 23, 42, 0.6)"
              strokeWidth="1.5"
              strokeDasharray="40 220"
              strokeLinecap="round"
            />
          </svg>

          {/* Centered Site Logo */}
          <div className="relative z-10 p-3.5 bg-white rounded-2xl shadow-xl border border-[#EAE6DF] flex items-center justify-center">
            <img
              src={OFFICIAL_MEDIA.logo}
              alt="Sharif Realty Group"
              className="h-14 sm:h-16 w-auto object-contain"
            />
          </div>
        </div>

        {/* Caption */}
        <div className="mt-5 text-center space-y-1">
          <p className="font-serif text-xs font-semibold tracking-widest text-[#B38B59] uppercase">
            Sharif Realty Group
          </p>
          <div className="flex items-center justify-center gap-1.5">
            <span className="size-1 rounded-full bg-[#C5A880] animate-ping" />
            <span className="size-1 rounded-full bg-[#C5A880]" />
            <span className="size-1 rounded-full bg-[#C5A880]" />
          </div>
        </div>
      </div>
    </div>
  );
}
