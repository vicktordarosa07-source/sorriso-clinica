"use client";

import { useEffect, useRef } from "react";

export default function MotionEffects() {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const progress = progressRef.current;
    const supportsReveal = "IntersectionObserver" in window;
    if (!progress) return;

    const updateProgress = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const percentage = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0;
      progress.style.transform = `scaleX(${percentage})`;
      progress.setAttribute("aria-valuenow", String(Math.round(percentage * 100)));
    };

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        updateProgress();
        frame = 0;
      });
    };

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    if (!supportsReveal || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        if (frame) window.cancelAnimationFrame(frame);
      };
    }

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -36px 0px" },
    );

    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element, index) => {
      element.style.setProperty("--reveal-delay", `${Math.min(index % 5, 4) * 65}ms`);
      revealObserver.observe(element);
    });
    document.documentElement.classList.add("motion-ready");

    return () => {
      revealObserver.disconnect();
      document.documentElement.classList.remove("motion-ready");
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={progressRef} className="page-progress" role="progressbar" aria-label="Progresso da página" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0} />;
}
