// import "jsr:@supabase/functions-js/edge-runtime.d.ts"; // Цей рядок більше не потрібен для Vercel Edge Functions
import { createClient } from "@supabase/supabase-js"; // Змінено на стандартний npm-імпорт

export const config = {
  runtime: 'edge',
};

// Змінено Deno.serve на export default
export default async (req) => {
  const origin = req.headers.get("Origin") || "";

  const allowedOrigins = [
    "https://lsd-piercing.vercel.app",
    "http://localhost:5173",
  ];

  const allowOriginHeader = allowedOrigins.includes(origin)
    ? origin
    : "https://lsd-piercing.vercel.app";

  const corsHeaders = {
    "Access-Control-Allow-Origin": allowOriginHeader,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
      status: 200,
    });
  }

  if (req.method !== "GET") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: { ...corsHeaders, Allow: "GET" },
    });
  }

  // Використовуємо process.env для доступу до змінних оточення
  const supabaseClient = createClient(
    process.env.SUPABASE_URL ?? "",
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  );

  try {
    const url = new URL(req.url);
    const startDateParam = url.searchParams.get("startDate");
    const endDateParam = url.searchParams.get("endDate");

    let sessionsQuery = supabaseClient.from("sessions").select("*");
    if (startDateParam && endDateParam) {
      sessionsQuery = sessionsQuery
        .gte("selected_date", startDateParam)
        .lte("selected_date", endDateParam);
    }
    sessionsQuery = sessionsQuery
      .order("selected_date", { ascending: true })
      .order("selected_time", { ascending: true });
    const { data: sessionsData, error: sessionsError } = await sessionsQuery;

    if (sessionsError) {
      console.error("Supabase sessions fetch error:", sessionsError.message);
      return new Response(JSON.stringify({ error: sessionsError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    let blockedDatesQuery = supabaseClient.from("blocked_dates").select("date");
    if (startDateParam && endDateParam) {
      blockedDatesQuery = blockedDatesQuery
        .gte("date", startDateParam)
        .lte("date", endDateParam);
    }
    const { data: blockedDatesData, error: blockedDatesError } = await blockedDatesQuery;

    if (blockedDatesError) {
      console.error("Supabase blocked_dates fetch error:", blockedDatesError.message);
      return new Response(JSON.stringify({ error: blockedDatesError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const formattedBlockedDates = blockedDatesData.map(row => row.date);

    let blockedTimeSlotsQuery = supabaseClient.from("blocked_time_slots").select("date, time");
    if (startDateParam && endDateParam) {
      blockedTimeSlotsQuery = blockedTimeSlotsQuery
        .gte("date", startDateParam)
        .lte("date", endDateParam);
    }
    const { data: blockedTimeSlotsData, error: blockedTimeSlotsError } = await blockedTimeSlotsQuery;

    if (blockedTimeSlotsError) {
      console.error("Supabase blocked_time_slots fetch error:", blockedTimeSlotsError.message);
      return new Response(JSON.stringify({ error: blockedTimeSlotsError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const formattedBlockedTimeSlots = {};
    blockedTimeSlotsData.forEach(slot => {
      if (!formattedBlockedTimeSlots[slot.date]) {
        formattedBlockedTimeSlots[slot.date] = [];
      }
      formattedBlockedTimeSlots[slot.date].push(slot.time);
    });

    return new Response(JSON.stringify({
      sessions: sessionsData,
      blockedDates: formattedBlockedDates,
      blockedTimeSlots: formattedBlockedTimeSlots,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error) {
    console.error("Server error:", (error as Error).message);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }
};