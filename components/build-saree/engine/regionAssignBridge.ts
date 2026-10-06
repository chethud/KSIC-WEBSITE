/** Tiny bridge so the assign toolbar can call into the live 3D session. */

export type RegionAssignApi = {
  reset: () => void;
  save: () => void;
  toggleMap: () => void;
  getMapOn: () => boolean;
};

let api: RegionAssignApi | null = null;
const listeners = new Set<() => void>();

export function registerRegionAssignApi(next: RegionAssignApi | null): void {
  api = next;
  listeners.forEach((l) => l());
}

export function getRegionAssignApi(): RegionAssignApi | null {
  return api;
}

export function subscribeRegionAssignApi(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
