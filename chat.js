const CORS_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store"
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: CORS_HEADERS });
}

export async function onRequestPost({ request, env }) {
  if (!env.HF_TOKEN) {
    return json({ error: "Falta configurar HF_TOKEN en las variables secretas de Cloudflare." }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "El mensaje no tenía un formato válido." }, 400);
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return json({ error: "Escribe un mensaje para empezar." }, 400);
  }

  const messages = body.messages.slice(-12).filter(
    (m) => m && ["user", "assistant"].includes(m.role) &&
      typeof m.content === "string" && m.content.length <= 4000
  );
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return json({ error: "No encontré un mensaje válido." }, 400);
  }

  const languageNames = {
    auto: "Detect the language used by the user and answer in that language.",
    es: "Spanish", en: "English", pt: "Portuguese", fr: "French",
    de: "German", ar: "Arabic", zh: "Chinese", ja: "Japanese"
  };
  const lang = languageNames[body.language] || languageNames.auto;
  const systemPrompt = `You are Nexa AI, a warm, kind, respectful and helpful multilingual assistant.
${lang}
Be friendly and emotionally considerate without pretending to be human or claiming to have real feelings.
Be clear and honest about uncertainty. Respect user autonomy and privacy. Keep answers useful and appropriately concise.
Follow essential safety protections. Do not assist with serious wrongdoing or dangerous instructions.`;

  try {
    const upstream = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.HF_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b:fastest",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        max_tokens: 700,
        stream: false
      })
    });

    const result = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      // Avoid sending provider details or secrets to visitors.
      const status = upstream.status === 429 ? 429 : 502;
      return json({
        error: upstream.status === 429
          ? "El servicio de IA alcanzó su límite temporal o de créditos. Inténtalo más tarde."
          : "El servicio de IA no respondió. Revisa que el token tenga permisos de inferencia y que el modelo esté disponible."
      }, status);
    }

    const reply = result?.choices?.[0]?.message?.content;
    if (typeof reply !== "string" || !reply.trim()) {
      return json({ error: "La IA no devolvió texto esta vez." }, 502);
    }
    return json({ reply: reply.trim() });
  } catch {
    return json({ error: "No se pudo contactar con el servicio de IA." }, 502);
  }
}
