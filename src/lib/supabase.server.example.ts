// Example Supabase server client for use in API routes or server components.
// This file is NOT wired into the app yet – it is here as a reference
// so you can see exactly how to configure a secure Supabase client.
//
// Steps to use:
// 1. Install the client: `npm install @supabase/supabase-js`
// 2. Create a real file `supabase.server.ts` next to this one
// 3. Copy the code below, uncomment it, and set env vars:
//    - SUPABASE_URL
//    - SUPABASE_SERVICE_ROLE_KEY (server-side only, never exposed to browser)

// import { createClient } from "@supabase/supabase-js";
//
// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
//
// if (!supabaseUrl || !supabaseServiceRoleKey) {
//   throw new Error(
//     "Supabase environment variables are not set. Please define SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
//   );
// }
//
// export const supabaseServer = createClient(supabaseUrl, supabaseServiceRoleKey, {
//   auth: {
//     persistSession: false,
//   },
// });

