import { checkSafety, SafetyCheckResult } from "./safety";
import { SPARK_SYSTEM_PROMPT } from "./systemPrompt";

export interface SparkResponse {
  text: string;
  checklist?: string[];
  safetyResult?: SafetyCheckResult;
}

export async function askSpark(userPrompt: string): Promise<SparkResponse> {
  // 1. Mandatory Safety & Medication Guardrails (Runs first before any AI call)
  const safety = checkSafety(userPrompt);
  if (safety.isBlocked && safety.message) {
    return {
      text: safety.message,
      safetyResult: safety,
    };
  }

  // 2. Check for optional configured AI Provider in env (Groq / OpenRouter / HF)
  const groqKey = process.env.GROQ_API_KEY;
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const hfKey = process.env.HUGGINGFACE_API_KEY;

  if (groqKey) {
    try {
      const response = await callOpenAICompatible(
        userPrompt,
        "https://api.groq.com/openai/v1/chat/completions",
        groqKey,
        "llama-3.1-8b-instant"
      );
      if (response) return parseSparkOutput(response);
    } catch (err) {
      console.warn("Groq API call error:", err);
    }
  }

  if (openRouterKey) {
    try {
      const response = await callOpenAICompatible(
        userPrompt,
        "https://openrouter.ai/api/v1/chat/completions",
        openRouterKey,
        "meta-llama/llama-3.2-3b-instruct:free"
      );
      if (response) return parseSparkOutput(response);
    } catch (err) {
      console.warn("OpenRouter API call error:", err);
    }
  }

  if (hfKey) {
    try {
      const response = await callHuggingFace(userPrompt, hfKey);
      if (response) return parseSparkOutput(response);
    } catch (err) {
      console.warn("HuggingFace API error:", err);
    }
  }

  // 3. ZERO-ENV Live Keyless Cloud AI Model (Pollinations public cluster)
  // Works automatically without the user having to setup any .env key!
  try {
    const liveKeylessText = await callKeylessLiveAI(userPrompt);
    if (liveKeylessText) {
      return parseSparkOutput(liveKeylessText);
    }
  } catch (err) {
    console.warn("Live keyless endpoint skipped, using instant fallback:", err);
  }

  // 4. Built-in Dynamic Spark Engine (Zero latency, guaranteed 100% uptime fallback)
  return generateContextualSparkResponse(userPrompt);
}

// Zero-setup live cloud AI call (No API key, no .env required)
async function callKeylessLiveAI(prompt: string): Promise<string | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4500);

  try {
    const res = await fetch("https://text.pollinations.ai/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        messages: [
          { role: "system", content: SPARK_SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        model: "openai",
        seed: Math.floor(Math.random() * 10000),
      }),
    });

    clearTimeout(timeoutId);
    if (!res.ok) return null;

    const text = await res.text();
    // Verify it's a real reply and not a rate-limit notice
    if (text && !text.includes("Free limit reached") && !text.includes("error")) {
      return text.trim();
    }
    return null;
  } catch {
    clearTimeout(timeoutId);
    return null;
  }
}

// Call OpenAI-compatible API (Groq / OpenRouter)
async function callOpenAICompatible(
  prompt: string,
  endpoint: string,
  apiKey: string,
  model: string
): Promise<string | null> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SPARK_SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 300,
    }),
  });

  if (!res.ok) throw new Error(`API error: ${res.statusText}`);
  const data = await res.json();
  return data?.choices?.[0]?.message?.content || null;
}

// Call HuggingFace Inference API (Free tier)
async function callHuggingFace(prompt: string, apiKey: string): Promise<string | null> {
  const res = await fetch(
    "https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-3B-Instruct/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "meta-llama/Llama-3.2-3B-Instruct",
        messages: [
          { role: "system", content: SPARK_SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    }
  );

  if (!res.ok) throw new Error(`HuggingFace error: ${res.statusText}`);
  const data = await res.json();
  return data?.choices?.[0]?.message?.content || null;
}

// Parse text and extract [STEP] micro checklist items
function parseSparkOutput(rawText: string): SparkResponse {
  const lines = rawText.split("\n");
  const checklist: string[] = [];
  const textLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("[STEP]") || trimmed.startsWith("- [STEP]") || trimmed.startsWith("* [STEP]")) {
      const stepText = trimmed.replace(/^[-*]?\s*\[STEP\]\s*/, "").trim();
      if (stepText) checklist.push(stepText);
    } else {
      textLines.push(line);
    }
  }

  return {
    text: textLines.join("\n").trim() || rawText,
    checklist: checklist.length > 0 ? checklist : undefined,
  };
}

// Built-in intelligent realistic motivational responses for instant out-of-the-box demo
function generateContextualSparkResponse(input: string): SparkResponse {
  const clean = input.trim().toLowerCase().replace(/[!?.,]/g, "");

  // 1. Natural friendly greetings (friendly, conversational, zero unsolicited checklists)
  const greetingExact = ["hi", "hey", "hello", "yo", "sup", "howdy", "heya", "hola", "hi spark", "hey spark"];
  if (greetingExact.includes(clean) || clean.startsWith("hi ") || clean.startsWith("hey ") || clean.startsWith("hello ")) {
    const greetings = [
      "Hey! So good to see you. How is your day going so far, or is your head feeling a bit scattered?",
      "Hey there! Great to see you. How's your energy level feeling right now?",
      "Hey friend! I'm here hanging out. How are things treating you today?",
    ];
    return {
      text: greetings[Math.floor(Math.random() * greetings.length)],
    };
  }

  // 2. Friendly check-in questions
  if (clean.includes("how are you") || clean.includes("how r u") || clean.includes("how are u") || clean.includes("what's up") || clean.includes("whats up")) {
    return {
      text: "I'm doing really well, thanks for asking! Just here ready to support you with whatever you're working on today. How's your mind feeling?",
    };
  }

  // 3. Gratitude & friendship
  if (clean.includes("thank") || clean.includes("thanks") || clean.includes("you're great") || clean.includes("youre the best")) {
    return {
      text: "Anytime! I'm genuinely happy to be in your corner. We'll take things one small step at a time.",
    };
  }

  // 4. Low energy
  if (clean.includes("energy") || clean.includes("tired") || clean.includes("exhausted") || clean.includes("sleepy") || clean.includes("drained")) {
    return {
      text: "I feel that. Having low energy days is so normal with ADHD. Don't push yourself to climb a mountain today—let's do one tiny thing to feel refreshed.",
      checklist: [
        "Take a slow drink of cold water",
        "Roll your shoulders and relax your jaw",
        "Pick just one 2-minute thing, or simply rest guilt-free",
      ],
    };
  }

  // 5. Trouble starting / inertia
  if (clean.includes("can't start") || clean.includes("cannot start") || clean.includes("procrastinating") || clean.includes("stuck") || clean.includes("hard to start")) {
    return {
      text: "Starting is honestly the hardest part. You don't have to finish or even do a good job—let's just 'touch' the task for 2 minutes to break the ice.",
      checklist: [
        "Open the page, app, or tool you need",
        "Write or do literally one single thing",
        "Stop after 2 minutes if your brain still resists",
      ],
    };
  }

  // 6. Overwhelmed / anxious
  if (clean.includes("overwhelmed") || clean.includes("too much") || clean.includes("anxious") || clean.includes("panic") || clean.includes("stressed")) {
    return {
      text: "Take a deep breath with me. Everything feels like an emergency when ADHD executive function is flooded, but you only have to exist in the next 3 minutes.",
      checklist: [
        "Take 2 slow, deep breaths",
        "Jot down the racing thoughts on paper to get them out of your head",
        "Ignore everything except the single easiest one",
      ],
    };
  }

  // 7. Explicit task breakdown request
  if (clean.includes("break down") || clean.includes("task") || clean.includes("project") || clean.includes("assignment") || clean.includes("clean") || clean.includes("study") || clean.includes("homework")) {
    return {
      text: "Let's chop this down so it doesn't feel like a scary monolith. You only need to look at step one for now.",
      checklist: [
        "Get all necessary items or tabs ready in one place",
        "Do just the first 3 minutes of rough work",
        "Take a quick breather before moving to step two",
      ],
    };
  }

  // 8. Celebrating small wins
  if (clean.includes("celebrate") || clean.includes("did it") || clean.includes("finished") || clean.includes("done") || clean.includes("i did")) {
    return {
      text: "Look at you! That genuinely counted, and I'm proud of you. Celebrate that win—every piece of momentum builds the next one.",
    };
  }

  // 9. Conversational default (friend-like, NO unsolicited checklist)
  return {
    text: "I'm right here with you. What's on your mind right now? Are we tackling something specific, or just need a gentle sounding board?",
  };
}
