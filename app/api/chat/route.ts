import { NextRequest, NextResponse } from "next/server";
import questionsData from "@/data/questions.json";

interface FAQItem {
  id: number;
  category: string;
  question: string;
  answer: string;
  examples?: string[];
}

const FAQ_DATA: Record<number, FAQItem> = {};
questionsData.forEach((item: FAQItem) => {
  FAQ_DATA[item.id] = item;
});

// Build a concise catalog for the LLM prompt once
const FAQ_PROMPT_CATALOG = questionsData
  .map((q: FAQItem) => {
    const examples = q.examples && q.examples.length > 0 ? ` (e.g. ${q.examples.slice(0, 3).join("; ")})` : "";
    return `ID ${q.id}: ${q.question}${examples}`;
  })
  .join("\n");

const FALLBACK_MESSAGE =
  "I'm sorry, I can only help with basic questions about our products and services. For more information, please contact the dealer at Info.scubemercantile@gmail.com or visit our office.";

const LIMIT_MESSAGE =
  "For further assistance, please contact the dealer directly at Info.scubemercantile@gmail.com or visit our office.";

const MAX_MESSAGES_PER_SESSION = 12;

// In-memory session tracking with auto-expiration
interface SessionState {
  count: number;
  lastActive: number;
}
const sessionStore = new Map<string, SessionState>();

// Periodic cleanup of sessions older than 24 hours
function cleanupSessions() {
  const now = Date.now();
  const ONE_DAY = 24 * 60 * 60 * 1000;
  for (const [key, session] of sessionStore.entries()) {
    if (now - session.lastActive > ONE_DAY) {
      sessionStore.delete(key);
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { session_id, message } = body;

    if (!session_id || typeof session_id !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing or invalid session_id" },
        { status: 400 }
      );
    }

    const trimmedMessage = (message || "").trim();
    if (!trimmedMessage) {
      return NextResponse.json(
        { success: false, error: "Message cannot be empty" },
        { status: 400 }
      );
    }

    // Occasional cleanup
    if (Math.random() < 0.05) {
      cleanupSessions();
    }

    // 1. Session tracking & rate limit check
    const currentSession = sessionStore.get(session_id) || { count: 0, lastActive: Date.now() };
    currentSession.count += 1;
    currentSession.lastActive = Date.now();
    sessionStore.set(session_id, currentSession);

    // If message limit exceeded, return static limit response without calling LLM
    if (currentSession.count > MAX_MESSAGES_PER_SESSION) {
      return NextResponse.json({
        success: true,
        answer: LIMIT_MESSAGE,
        message_count: currentSession.count,
        limit_reached: true,
      });
    }

    // 2. Fast-path checks for common greetings & courtesy (instant response, saves LLM quota)
    const normalized = trimmedMessage.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
    const isGreeting = /^(hi|hello|hey|heya|hi there|hello there|good morning|good afternoon|good evening|namaste|greetings)$/i.test(normalized);
    if (isGreeting && FAQ_DATA[38]) {
      return NextResponse.json({
        success: true,
        answer: FAQ_DATA[38].answer,
        matched_faq_id: 38,
        message_count: currentSession.count,
        limit_reached: currentSession.count >= MAX_MESSAGES_PER_SESSION,
      });
    }

    const isCourtesy = /^(thank you|thanks|thanks a lot|thank you so much|bye|goodbye|ok bye|okay bye|alright thanks)$/i.test(normalized);
    if (isCourtesy && FAQ_DATA[39]) {
      return NextResponse.json({
        success: true,
        answer: FAQ_DATA[39].answer,
        matched_faq_id: 39,
        message_count: currentSession.count,
        limit_reached: currentSession.count >= MAX_MESSAGES_PER_SESSION,
      });
    }

    // 3. Prepare LLM Matching Request
    const apiKey = (process.env.GEMINI_API_KEY || "").trim().replace(/;+$/, "");
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not configured in environment variables.");
      return NextResponse.json({
        success: true,
        answer: FALLBACK_MESSAGE,
        message_count: currentSession.count,
        limit_reached: currentSession.count >= MAX_MESSAGES_PER_SESSION,
      });
    }

    const systemPrompt = `You are an FAQ matching system for S-Cube Mercantile, a solar dealer and distributor in Guwahati, Assam.

Your ONLY task is to determine whether the user's message matches one of the provided FAQ questions.

Rules:
1. You must NOT answer the user's question.
2. You must NOT generate explanations, advice, or new company information.
3. You must NOT use outside knowledge.
4. Return ONLY valid JSON in this exact format:
{"faq_id": number}

5. If none of the FAQs match the user's question, return:
{"faq_id": null}

6. A match does not require identical wording. Understand short, misspelled, or differently phrased questions (e.g. "where is your office?", "location?", "address" all match the location question).
7. If the meaning is not sufficiently similar or is about unrelated topics, return {"faq_id": null}. Do not force a match.

FAQ CATALOG:
${FAQ_PROMPT_CATALOG}`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`;

    const payload = {
      system_instruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: `User query: "${trimmedMessage}"` }],
        },
      ],
      generationConfig: {
        temperature: 0.0,
        responseMimeType: "application/json",
      },
    };

    let matchedFaqId: number | null = null;

    try {
      const response = await fetch(geminiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (responseText) {
          try {
            const parsed = JSON.parse(responseText);
            if (typeof parsed.faq_id === "number") {
              matchedFaqId = parsed.faq_id;
            }
          } catch (jsonErr) {
            console.warn("Failed to parse Gemini JSON output:", responseText, jsonErr);
          }
        }
      } else {
        const errText = await response.text();
        console.error("Gemini API returned error:", response.status, errText);
      }
    } catch (apiErr) {
      console.error("Failed to fetch Gemini API:", apiErr);
    }

    // 3. Output resolution and safety verification
    let answer = FALLBACK_MESSAGE;
    if (matchedFaqId !== null && FAQ_DATA[matchedFaqId]) {
      answer = FAQ_DATA[matchedFaqId].answer;
    }

    return NextResponse.json({
      success: true,
      answer,
      matched_faq_id: matchedFaqId && FAQ_DATA[matchedFaqId] ? matchedFaqId : null,
      message_count: currentSession.count,
      limit_reached: currentSession.count >= MAX_MESSAGES_PER_SESSION,
    });
  } catch (err: unknown) {
    console.error("Unexpected error in /api/chat:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        answer: FALLBACK_MESSAGE,
      },
      { status: 500 }
    );
  }
}
