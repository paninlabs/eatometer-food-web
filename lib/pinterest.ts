declare global {
  interface Window {
    pintrk?: (...args: unknown[]) => void;
  }
}

/**
 * Fires a Pinterest conversion event. No-op during SSR or before the Pinterest
 * tag has loaded. A unique `event_id` is generated for deduplication unless one
 * is supplied.
 */
export function pinterestTrack(eventName: string, data: Record<string, unknown> = {}): void {
  if (typeof window === "undefined" || typeof window.pintrk !== "function") {
    return;
  }

  const eventId =
    (data.event_id as string | undefined) ??
    (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${eventName}-${Date.now()}-${Math.random().toString(36).slice(2)}`);

  window.pintrk("track", eventName, { ...data, event_id: eventId });
}
