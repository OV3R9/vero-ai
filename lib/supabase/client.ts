import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "../api";

const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

export default supabase;
