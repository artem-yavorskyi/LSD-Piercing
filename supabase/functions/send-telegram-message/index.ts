// deno-lint-ignore-file
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "https://lsd-piercing.vercel.app",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
      status: 200,
    });
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: { ...corsHeaders, Allow: "POST" },
    });
  }

  let requestData = await req.json();

  const {
    name,
    last_name,
    phone_number,
    instagram,
    comment,
    selected_date,
    selected_time,
  } = requestData;

  const token = Deno.env.get("TELEGRAM_BOT_TOKEN");
  const chatId = Deno.env.get("TELEGRAM_CHAT_ID");

  if (!token || !chatId) {
    return new Response("Telegraam secrets not set", {
      status: 500,
      headers: corsHeaders,
    });
  }

  let message = `🔔 Новий запис:\n\n👤 | Ім'я, прізвище: ${name} ${last_name}\n📱 | Телефон: ${phone_number}\n📅 | Дата: ${selected_date}\n⏳ | Час: ${selected_time}`;

  if (instagram) {
    message += `\n📷 | Інстарам: ${instagram}`;
  }
  if (comment) {
    message += `\n💬 | Коментар: ${comment}`;
  }

  try {
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", ...corsHeaders },
        body: JSON.stringify({ chat_id: chatId, text: message }),
      }
    );

    if (!telegramResponse.ok) {
      const errorText = await telegramResponse.text();
      console.log("Telegram API Error:", errorText);
      return new Response(`Telegram Error: ${errorText}`, {
        status: 500,
        headers: corsHeaders,
      });
    }

    return new Response("Sent message", { status: 200, headers: corsHeaders });
  } catch (error) {
    return new Response(`Server error: ${(error as Error).message}`, {
      status: 500,
      headers: corsHeaders,
    });
  }
});
