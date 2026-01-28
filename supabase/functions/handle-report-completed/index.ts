// Supabase Edge Function: handle-report-completed
//
// Intended flow:
// - Your n8n workflow finishes generating an AI readiness report and
//   writes it into `ai_readiness_reports`.
// - Then n8n calls this function with the `requestId`.
// - This function:
//   1) Looks up the associated request to get `email` and `user_id`
//   2) Marks the request as `completed`
//   3) Generates a Supabase Auth magic link for that user
//   4) Calls a separate n8n webhook (N8N_MAGICLINK_WEBHOOK_URL) with
//      { requestId, userId, email, magicLink } so n8n can send the email.

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

type CompletionPayload = {
  requestId: string;
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const n8nMagiclinkWebhookUrl = Deno.env.get("N8N_MAGICLINK_WEBHOOK_URL") ?? "";
const reportRedirectUrl = Deno.env.get("REPORT_REDIRECT_URL") ?? "";

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let body: CompletionPayload;
  try {
    body = (await req.json()) as CompletionPayload;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON payload" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!body.requestId) {
    return new Response(
      JSON.stringify({ error: "requestId is required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // 1) Look up the original request to get email + user_id
  const { data: requestRow, error: requestError } = await supabase
    .from("ai_readiness_requests")
    .select("id, email, user_id, status")
    .eq("id", body.requestId)
    .single();

  if (requestError || !requestRow) {
    console.error("Failed to load ai_readiness_requests", requestError);
    return new Response(
      JSON.stringify({ error: "Request not found" }),
      {
        status: 404,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // 2) Mark the request as completed
  const { error: updateError } = await supabase
    .from("ai_readiness_requests")
    .update({ status: "completed" })
    .eq("id", body.requestId);

  if (updateError) {
    console.error("Failed to update request status", updateError);
  }

  // 3) Generate a magic link for the user
  let magicLink: string | null = null;
  if (requestRow.user_id) {
    const { data: linkData, error: linkError } =
      await supabase.auth.admin.generateLink({
        type: "magiclink",
        email: requestRow.email,
        options: reportRedirectUrl
          ? {
              redirectTo: reportRedirectUrl,
            }
          : undefined,
      });

    if (linkError) {
      console.error("Failed to generate magic link", linkError);
    } else {
      magicLink = linkData?.properties?.action_link ?? null;
    }
  }

  // 4) Notify n8n to send the email containing the magic link
  if (!n8nMagiclinkWebhookUrl) {
    console.warn("N8N_MAGICLINK_WEBHOOK_URL is not set");
  } else {
    try {
      await fetch(n8nMagiclinkWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: requestRow.id,
          userId: requestRow.user_id,
          email: requestRow.email,
          magicLink,
        }),
      });
    } catch (err) {
      console.error("Failed to call N8N magic link webhook", err);
    }
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});


