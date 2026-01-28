// This API route receives the onboarding answers from the frontend
// and writes them into Supabase, then optionally triggers your n8n
// webhook for further processing.

import { supabaseServer } from "@/lib/supabase.server";

export type AiReadinessPayload = {
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

export async function POST(request: Request) {
  let body: AiReadinessPayload;

  try {
    body = (await request.json()) as AiReadinessPayload;
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON payload" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  if (!body.email || !body.consent) {
    return new Response(
      JSON.stringify({
        error: "Email and consent are required",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  // At least one identifier for the business.
  if (!body.websiteUrl && !body.companyName) {
    return new Response(
      JSON.stringify({
        error: "Website URL or company name is required",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  // Ensure a Supabase Auth user exists for this email.
  // We don't send any email yet; this is just to reserve a user_id
  // so later we can generate a magic link and attach reports securely.
  let userId: string | null = null;
  try {
    const { data: createdUser, error: createError } =
      await supabaseServer.auth.admin.createUser({
        email: body.email,
        email_confirm: true, // mark as confirmed; we'll send magic link later
      });

    if (createError) {
      // If the user already exists, Supabase will return an error like
      // "User already registered". We can safely ignore that here.
      console.error("Failed to create auth user", createError);
    } else {
      userId = createdUser.user?.id ?? null;
    }
  } catch (err) {
    console.error("Auth admin error", err);
  }

  // Insert into Supabase (link to user_id if we have one)
  const { data, error } = await supabaseServer
    .from("ai_readiness_requests")
    .insert({
      email: body.email,
      consent_accepted: body.consent,
      industry: body.industry,
      website_url: body.websiteUrl || null,
      company_name: body.companyName || null,
      company_size: body.companySize ?? null,
      ai_adoption_level: body.aiAdoption ?? null,
      ai_talent: body.aiTalent ?? null,
      business_goals: body.businessGoals,
      response_speed_to_leads: body.responseSpeed ?? null,
      missed_calls: body.missedCalls ?? null,
      additional_context: body.additionalContext,
      user_id: userId,
      status: "pending",
    })
    .select("id, email, user_id")
    .single();

  if (error || !data) {
    console.error("Supabase insert error", error);
    return new Response(
      JSON.stringify({ error: "Failed to save request" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  // Optionally trigger n8n if webhook is configured
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: data.id,
          email: data.email,
          userId: data.user_id,
        }),
      });
    } catch (err) {
      console.error("Failed to call n8n webhook", err);
      // We don't fail the whole request; report is still saved.
    }
  }

  return new Response(
    JSON.stringify({ ok: true, id: data.id }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
}

