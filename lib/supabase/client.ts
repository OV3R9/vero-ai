import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "../api";

const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
