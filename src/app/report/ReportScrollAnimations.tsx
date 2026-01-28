"use client";

import { useEffect } from "react";

export function ReportScrollAnimations() {
  useEffect(() => {
    const selector = "[data-report-scroll]";
    const els = document.querySelectorAll(selector);
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("report-scroll-in-visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    );

    els.forEach((el) => observer.observe(el));
    return () => els.forEach((el) => observer.unobserve(el));
  }, []);

  return null;
}
