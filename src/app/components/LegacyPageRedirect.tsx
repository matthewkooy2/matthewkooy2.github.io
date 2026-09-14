"use client";

import { useEffect } from "react";
import { getLegacyDestination } from "./gallery/legacyDestination";

export default function LegacyPageRedirect({ fallback }: { fallback: string }) {
  useEffect(() => {
    // URL fragments are only available in the browser. Preserve employer/club
    // bookmarks as well as project URLs, replacing the obsolete history entry.
    window.location.replace(getLegacyDestination(window.location.pathname, window.location.hash));
  }, []);

  return <main className="p-8"><a href={fallback}>Continue to Matthew Kooy’s portfolio</a></main>;
}
