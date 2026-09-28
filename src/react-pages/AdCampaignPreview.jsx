import { useEffect, useState } from "react";
import AdCampaignLanding from "./AdCampaignLanding.jsx";
import { PREVIEW_MESSAGE } from "./ad-campaign/config.js";

// Runs inside the admin editor's preview iframe (/admin/campaigns/preview).
// The editor posts the unsaved campaign on every change; this renders it with
// the real landing templates in preview mode (forms never submit).

export default function AdCampaignPreview({ googleMapsApiKey }) {
  const [campaign, setCampaign] = useState(null);

  useEffect(() => {
    function onMessage(event) {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === PREVIEW_MESSAGE && event.data.campaign) setCampaign(event.data.campaign);
    }
    window.addEventListener("message", onMessage);
    window.parent?.postMessage({ type: `${PREVIEW_MESSAGE}-ready` }, window.location.origin);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  if (!campaign) {
    return <p className="p-8 text-center text-sm text-slate-400">Memuat preview...</p>;
  }
  return <AdCampaignLanding campaign={campaign} googleMapsApiKey={googleMapsApiKey} preview />;
}
