// Supabase Edge Function: submit-ai-readiness
//
// This is an alternative to the Next.js API route. You can deploy this
// into your Supabase project and call it directly from the frontend
// instead of hitting /api/ai-readiness in Next.
//
// Usage outline:
// - Copy this folder into `supabase/functions/submit-ai-readiness`
// - Run `supabase functions deploy submit-ai-readiness`
// - From your frontend, call the function via the Supabase client or HTTP.

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

type AiReadinessPayload = {
  email: string;
  consent: boolean;
  industry: string;
  websiteUrl: string;
  companyName: string;
  companySize?: "small" | "medium" | "large";
  aiAdoption?: "none" | "experimenting" | "few_places" | "mature";
  aiTalent?: "in_house" | "consultants" | "none";
  businessGoals: string[];
  responseSpeed?: string;
  missedCalls?: string;
  additionalContext: string;
};

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let body: AiReadinessPayload;
  try {
    body = (await req.json()) as AiReadinessPayload;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON payload" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!body.email || !body.consent) {
    return new Response(
      JSON.stringify({ error: "Email and consent are required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  if (!body.websiteUrl || !body.websiteUrl.trim()) {
    return new Response(
      JSON.stringify({ error: "Website URL is required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // TODO: Use the service role key from the environment to create
  // a Supabase client and insert this payload into the
  // ai_readiness_requests table, similar to the example shown in
  // the Next.js route.
  //
  // After inserting, you can:
  // - Trigger your n8n webhook directly from here, OR
  // - Let a DB trigger in Supabase call a separate function.

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

