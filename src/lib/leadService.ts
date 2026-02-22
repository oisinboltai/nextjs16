export type LeadSource = "quote" | "savings_calculator" | "hvac_checklist" | "contact";

export interface LeadPayload {
  source: LeadSource;
  timestamp: string;
  data: Record<string, unknown>;
}

export interface SubmitLeadResult {
  ok: boolean;
  error?: string;
}

const WEBHOOK_URL = "/api/lead";

if (WEBHOOK_URL?.includes("/webhook-test/")) {
  throw new Error("VITE_N8N_WEBHOOK_URL must be the PRODUCTION webhook (/webhook/), not /webhook-test/");
}

export async function submitLead(options: {
  source: LeadSource;
  data: Record<string, unknown>;
}): Promise<SubmitLeadResult> {
  if (!WEBHOOK_URL) {
    return { ok: false, error: "Webhook URL not configured (VITE_N8N_WEBHOOK_URL)" };
  }

  const payload: LeadPayload = {
    source: options.source,
    timestamp: new Date().toISOString(),
    data: options.data,
  };

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      return {
        ok: false,
        error: `Webhook returned ${response.status} ${response.statusText}${text ? ` - ${text}` : ""}`,
      };
    }

    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Network error";
    return { ok: false, error: message };
  }
}
