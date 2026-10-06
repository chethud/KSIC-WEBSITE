"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { STEPS } from "../data/catalog";
import { useCustomizerStore } from "../store/customizerStore";
import { ColorSelector } from "./selectors/ColorSelector";
import { BorderSelector } from "./selectors/BorderSelector";
import { PalluSelector } from "./selectors/PalluSelector";
import { BlouseSelector } from "./selectors/BlouseSelector";
import { ZariSelector } from "./selectors/ZariSelector";
import { FinishSelector } from "./selectors/FinishSelector";
import { PriceSummary } from "./PriceSummary";
import { SaveDesign } from "./SaveDesign";
import { ShareDesign } from "./ShareDesign";

const STEP_ICONS: Record<(typeof STEPS)[number]["id"], ReactNode> = {
  colour: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
    </svg>
  ),
  border: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="5" y="5" width="14" height="14" rx="1.5" />
      <path d="M5 9h14M5 15h14" />
    </svg>
  ),
  pallu: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M7 4h10v16H7z" />
      <path d="M7 8h10M7 16h10" />
    </svg>
  ),
  blouse: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 4h6l2 3 3 1v3l-3 1v8H7v-8l-3-1V8l3-1 2-3z" />
    </svg>
  ),
  zari: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 3l1.8 5.4H19l-4.4 3.2 1.7 5.4L12 14.8 7.7 17l1.7-5.4L5 8.4h5.2L12 3z" />
    </svg>
  ),
  finish: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M5 12l4.5 4.5L19 7" />
    </svg>
  ),
};

export function CustomizerPanel() {
  const step = useCustomizerStore((s) => s.step);
  const setStep = useCustomizerStore((s) => s.setStep);
  const addToBag = useCustomizerStore((s) => s.addToBag);
  const cameraView = useCustomizerStore((s) => s.cameraView);
  const stepIndex = STEPS.findIndex((s) => s.id === step);
  const viewLabel =
    cameraView === "three-quarter" ? "Front" : cameraView.replace(/^\w/, (c) => c.toUpperCase());

  const goNext = () => {
    if (stepIndex < STEPS.length - 1) setStep(STEPS[stepIndex + 1].id);
  };
  const goPrev = () => {
    if (stepIndex > 0) setStep(STEPS[stepIndex - 1].id);
  };

  return (
    <aside className="customizer-panel" aria-label="Saree customizer">
      <div className="panel-chrome">
        <div className="panel-progress-meta">
          <span>
            Step {stepIndex + 1} of {STEPS.length}
          </span>
        </div>

        <nav className="step-rail" aria-label="Customization steps">
          {STEPS.map((s, i) => {
            const done = i < stepIndex;
            const active = step === s.id;
            return (
              <button
                key={s.id}
                type="button"
                className={`step-node${active ? " is-active" : ""}${done ? " is-done" : ""}`}
                onClick={() => setStep(s.id)}
                aria-current={active ? "step" : undefined}
                aria-label={`${s.label}${done ? ", completed" : ""}`}
              >
                <span className="step-node-icon" aria-hidden>
                  {done ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M5 12.5 10 17l9-10" />
                    </svg>
                  ) : (
                    STEP_ICONS[s.id]
                  )}
                </span>
                <span className="step-node-label">{s.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="panel-scroll">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {step === "colour" && <ColorSelector />}
            {step === "border" && <BorderSelector />}
            {step === "pallu" && <PalluSelector />}
            {step === "blouse" && <BlouseSelector />}
            {step === "zari" && <ZariSelector />}
            {step === "finish" && (
              <>
                <FinishSelector />
                <PriceSummary />
                <SaveDesign />
                <ShareDesign />
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="panel-footer">
        <button
          type="button"
          className="ghost-btn"
          onClick={goPrev}
          disabled={stepIndex === 0}
          aria-label="Previous step"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path d="M15 6 9 12l6 6" />
          </svg>
          Back
        </button>

        <div className="panel-footer-mid" aria-live="polite">
          <span className="panel-footer-count">
            {stepIndex + 1}/{STEPS.length}
          </span>
          <span className="panel-footer-view">{viewLabel}</span>
        </div>

        {stepIndex < STEPS.length - 1 ? (
          <button type="button" className="primary-cta" onClick={goNext}>
            Continue
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        ) : (
          <button type="button" className="primary-cta" onClick={addToBag}>
            Add to Bag
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        )}
      </div>
    </aside>
  );
}
