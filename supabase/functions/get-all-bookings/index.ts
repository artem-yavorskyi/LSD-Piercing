import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, x-client-info, apikey",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "GET") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: { ...corsHeaders, Allow: "GET" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  console.log(
    "DEBUG: SUPABASE_URL length:",
    supabaseUrl ? supabaseUrl.length : "undefined",
  );
  console.log(
    "DEBUG: SUPABASE_SERVICE_ROLE_KEY length:",
    supabaseServiceRoleKey ? supabaseServiceRoleKey.length : "undefined",
  );
  console.log(
    "DEBUG: SUPABASE_URL starts with https://",
    supabaseUrl?.startsWith("https://"),
  );

  const supabaseClient = createClient(
    supabaseUrl ?? "",
    supabaseServiceRoleKey ?? "",
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
    const { data: blockedDatesData, error: blockedDatesError } =
      await blockedDatesQuery;

    if (blockedDatesError) {
      console.error(
        "Supabase blocked_dates fetch error:",
        blockedDatesError.message,
      );
      return new Response(
        JSON.stringify({ error: blockedDatesError.message }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    const formattedBlockedDates = blockedDatesData
      ? blockedDatesData.map((row) => row.date)
      : [];

    let blockedTimeSlotsQuery = supabaseClient.from("blocked_time_slots")
      .select("date, time");
    if (startDateParam && endDateParam) {
      blockedTimeSlotsQuery = blockedTimeSlotsQuery
        .gte("date", startDateParam)
        .lte("date", endDateParam);
    }
    const { data: blockedTimeSlotsData, error: blockedTimeSlotsError } =
      await blockedTimeSlotsQuery;

    if (blockedTimeSlotsError) {
      console.error(
        "Supabase blocked_time_slots fetch error:",
        blockedTimeSlotsError.message,
      );
      return new Response(
        JSON.stringify({ error: blockedTimeSlotsError.message }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    const formattedBlockedTimeSlots: { [key: string]: string[] } = {};
    if (blockedTimeSlotsData) {
      blockedTimeSlotsData.forEach((slot) => {
        if (!formattedBlockedTimeSlots[slot.date]) {
          formattedBlockedTimeSlots[slot.date] = [];
        }
        formattedBlockedTimeSlots[slot.date].push(slot.time);
      });
    }

    return new Response(
      JSON.stringify({
        sessions: sessionsData,
        blockedDates: formattedBlockedDates,
        blockedTimeSlots: formattedBlockedTimeSlots,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
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
});
