import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { query, type } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let prompt = "";
    let systemPrompt = "";

    if (type === "recipe") {
      systemPrompt = `You are a Tamil Nadu food expert. Search and return recipes based on the user's query. Return JSON array of recipes.`;
      prompt = `Search for Tamil/Indian recipes matching: "${query}"

Return a JSON array of up to 6 recipes:
[{
  "name": "Recipe Name",
  "calories": number (per serving),
  "category": "breakfast" | "lunch" | "dinner" | "drinks" | "snack",
  "time": "XX min",
  "ingredients": ["ingredient 1", "ingredient 2"],
  "method": ["step 1", "step 2"]
}]

Include a mix of Tamil Nadu traditional and popular Indian recipes. Return ONLY the JSON array.`;
    } else {
      systemPrompt = `You are a nutrition database expert specializing in Indian and Tamil Nadu foods. Return accurate calorie data.`;
      prompt = `Search for foods matching: "${query}"

Return a JSON array of up to 10 food items with their calorie count per standard serving:
[{"name": "Food Name", "calories": number, "serving": "1 cup / 1 piece / 100g"}]

Include Indian/Tamil foods if relevant, and international foods too. Be accurate with calories. Return ONLY the JSON array.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const t = await response.text();
      console.error("AI error:", response.status, t);
      return new Response(JSON.stringify({ error: "Search failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || "[]";
    content = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

    const results = JSON.parse(content);

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("search-food error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
