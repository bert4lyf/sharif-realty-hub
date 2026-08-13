type GtagWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const w = window as GtagWindow;
  w.dataLayer = w.dataLayer ?? [];
  if (typeof w.gtag === "function") {
    w.gtag("event", event, params);
  } else {
    w.dataLayer.push(["event", event, params]);
  }
}

export function loadGa4(measurementId: string) {
  if (typeof window === "undefined" || !measurementId) return;
  const w = window as GtagWindow;
  if (document.getElementById("ga4-src")) return;

  const script = document.createElement("script");
  script.id = "ga4-src";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);

  w.dataLayer = w.dataLayer ?? [];
  w.gtag = function gtag(...args: unknown[]) {
    w.dataLayer!.push(args);
  };
  w.gtag("js", new Date());
  w.gtag("config", measurementId);
}
