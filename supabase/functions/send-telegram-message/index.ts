import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import {serve} from "https://deno.land/std/http/server.ts";


Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response("Method Not Allowed", {status: 405, headers: {"Allow": "POST"}})
  }

  let requestData = await req.json()

  const {name, last_name, phone_number, instagram, comment, selected_date, selected_time} = requestData

  const token = Deno.env.get("TELEGRAM_BOT_TOKEN")
  const chatId = Deno.env.get("TELEGRAM_CHAT_ID")

  if (!token || !chatId) {
    return new Response("Telegraam secrets not set", {status: 500})
  }

  let message = `Новий запис:\n\nІм'я: ${name}\nПрізвище: ${last_name}\nТелефон: ${phone_number}\nДата: ${selected_date}\nЧас: ${selected_time}\nІнстарам: ${instagram}\nКоментар: ${comment}`

  try {
    const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({chat_id: chatId, text:message})
    })
  
    if (!telegramResponse.ok) {
      const errorText = await telegramResponse.text()
      console.log("Telegram API Error:", errorText)
      return new Response(`Telegram Error: ${errorText}, {status: 500}`)
    }

    return new Response("Sent message", {status: 200})

  } catch(error) {
    return new Response(`Server errror: ${error.message}`, {status: 500})
    }
})