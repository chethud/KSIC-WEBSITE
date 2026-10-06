"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
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
  const bootstrap = useCustomizerStore((s) => s.bootstrap);
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
