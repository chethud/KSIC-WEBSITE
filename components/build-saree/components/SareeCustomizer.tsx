"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { getSaree } from "@/lib/saree-catalog";
import { MAHARAJA_PRODUCTS } from "@/lib/maharaja-products";
import { CustomizerPanel } from "./CustomizerPanel";
import { SareeViewer } from "./viewer/SareeViewer";
import { RegionAssignBar } from "./viewer/RegionAssignBar";
import { ModelViewSelector } from "./atelier/ModelViewSelector";
import { useCustomizerStore } from "../store/customizerStore";
import {
  getRegionAssignApi,
  subscribeRegionAssignApi,
} from "../engine/regionAssignBridge";

function useAssignApi() {
  return useSyncExternalStore(
    subscribeRegionAssignApi,
    getRegionAssignApi,
    () => null
  );
}

export function SareeCustomizer() {
  const params = useSearchParams();
  const silkId = params.get("silk");
  const silkName =
    (silkId && getSaree(silkId)?.name) ||
    MAHARAJA_PRODUCTS.find((item) => item.slug === silkId)?.name ||
    "";
  const bootstrap = useCustomizerStore((s) => s.bootstrap);
  const saveCurrentDesign = useCustomizerStore((s) => s.saveCurrentDesign);
  const toast = useCustomizerStore((s) => s.toast);
  const clearToast = useCustomizerStore((s) => s.clearToast);
  const modelEditMode = useCustomizerStore((s) => s.modelEditMode);
  const toggleModelEditMode = useCustomizerStore((s) => s.toggleModelEditMode);
  const [mapOn, setMapOn] = useState(false);
  const assignApi = useAssignApi();

  useEffect(() => {
    document.documentElement.classList.add("studio-active");
    return () => document.documentElement.classList.remove("studio-active");
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    const resume = () => saveCurrentDesign();
    window.addEventListener("ksic:resume-save", resume);
    return () => window.removeEventListener("ksic:resume-save", resume);
  }, [saveCurrentDesign]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(clearToast, 2800);
    return () => clearTimeout(t);
  }, [toast, clearToast]);

  useEffect(() => {
    if (!modelEditMode) setMapOn(false);
  }, [modelEditMode]);

  return (
    <div className={`studio-page${modelEditMode ? " is-model-editing" : ""}`}>
      <main className="atelier-layout">
        <section className="viewer-stage" aria-label="Saree preview">
          {silkName ? (
            <p className="studio-context">
              <strong>{silkName}</strong>
              The studio shows the house model, not this saree&apos;s woven photograph. Colour and zari changes apply here.
            </p>
          ) : null}
          <div className="viewer-atmosphere" aria-hidden />
          <div className="viewer-glow" aria-hidden />
          {!modelEditMode ? (
            <button
              type="button"
              className="studio-tool-btn"
              aria-pressed={false}
              onClick={() => toggleModelEditMode()}
            >
              Edit model
            </button>
          ) : (
            <button
              type="button"
              className="studio-tool-btn is-editing-label"
              aria-pressed
              onClick={() => toggleModelEditMode()}
            >
              EDIT MODEL
            </button>
          )}
          <SareeViewer />
          {!modelEditMode && <ModelViewSelector />}
        </section>

        {modelEditMode ? (
          <aside className="assign-side-panel" aria-label="Assign saree parts">
            <RegionAssignBar
              mapOn={mapOn}
              onReset={() => assignApi?.reset()}
              onSave={() => assignApi?.save()}
              onToggleMap={() => {
                assignApi?.toggleMap();
                setMapOn(!!assignApi?.getMapOn());
              }}
            />
          </aside>
        ) : (
          <CustomizerPanel />
        )}
      </main>

      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}
