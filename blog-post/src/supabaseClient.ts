import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://lthmaxafyqrevuazaswe.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0aG1heGFmeXFyZXZ1YXphc3dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMTY4MDEsImV4cCI6MjA2NTg5MjgwMX0.phEcDwQVDXDNCaeO_cBvB8WBxOPr21IfD2j9cxGdsVE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
