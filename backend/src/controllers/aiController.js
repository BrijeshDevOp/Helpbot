const Groq = require('groq-sdk');

// Validate API key at startup — fail fast with a clear message
if (!process.env.GROQ_API_KEY) {
  console.error('❌ GROQ_API_KEY is missing from .env — AI chat will not work.');
}

// Instantiate once at module level (env is already loaded by server.js)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || 'missing' });

const SYSTEM_PROMPT = `You are a friendly IT helpdesk assistant.
Talk like a real human: warm, conversational, simple, and short. Easy to understand for anyone.
Keep responses concise, typically 2 to 4 quick, clear steps or simple sentences.

FORMATTING RULES:
- Do NOT use any formatting characters or symbols.
- Absolutely NO asterisks (* or **), NO hashes (#), NO backticks, NO underscores, NO tildes (~), NO bullet symbols (- or •).
- Use ONLY plain text: letters, numbers, normal punctuation (periods, commas, question marks), regular spaces, tabs, and line breaks.
- When listing steps, use simple numbering (1. 2. 3.) or indent with a space or tab.
- Do NOT use markdown syntax anywhere.

STRICT SCOPE & TICKET ESCALATION RULES:
1. You ONLY provide basic troubleshooting for:
   - Windows system configuration (settings, display/resolution, sound/audio, power/sleep, basic updates, task manager, startup apps).
   - Mac / macOS system configuration (system settings/preferences, display, sound/audio, basic updates, activity monitor, Finder).
2. For ANY other requests outside basic Windows or Mac system configuration troubleshooting (such as: general questions, printers, hardware repair, network cable wiring, phones/mobile devices, coding, password resets, account billing, software purchases, HR, or non-IT topics), you MUST NOT answer the question. Instead, directly prompt the user to create a ticket by responding with exactly this JSON:
   {"type": "escalate", "message": "I only handle basic Windows and Mac system configuration troubleshooting. Please create a support ticket below so our team can assist you with this directly."}
3. If the user asks to speak to a person, talk to a human, or create a ticket, reply with exactly:
   {"type": "escalate", "message": "No problem! Please click below to create a support ticket."}
4. If a Windows or Mac configuration issue is too complex or cannot be resolved with basic troubleshooting, reply with:
   {"type": "escalate", "message": "This issue might require hands-on support. Please create a ticket below so our IT team can help you directly."}`;

// Helper to remove any markdown/formatting characters and keep clean text with spaces/tabs
const cleanFormatting = (text) => {
  if (!text || typeof text !== 'string') return text;

  return text
    // Remove code block markers like ```json or ```
    .replace(/^```[a-zA-Z]*\n?/gm, '')
    .replace(/```$/gm, '')
    // Remove markdown headers (# Header)
    .replace(/^#{1,6}\s+/gm, '')
    // Convert markdown bullets (*, -, +, •) to spaces/tab indent
    .replace(/^[\t ]*[-*+•]\s+/gm, '    ')
    // Remove asterisks, underscores, backticks, tildes
    .replace(/[*_~`]/g, '')
    // Clean trailing line spaces while preserving tabs and line breaks
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .trim();
};

// @desc    Send message to Groq AI
// @route   POST /api/ai/chat
// @access  Public
const chat = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ success: false, message: 'Messages array is required' });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(503).json({
        success: false,
        message: 'AI service is not configured. Please set GROQ_API_KEY in .env',
      });
    }

    const response = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || 'openai/gpt-oss-20b',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
      max_tokens: 512,
      temperature: 0.2,
    });

    const aiMessage = response.choices[0].message.content;

    // Detect escalation JSON response
    let parsed = null;
    try {
      const jsonCandidate = aiMessage.replace(/```json/gi, '').replace(/```/g, '').trim();
      parsed = JSON.parse(jsonCandidate);
    } catch {
      // Normal text answer — not JSON
    }

    if (parsed && parsed.type === 'escalate') {
      return res.status(200).json({
        success: true,
        type: 'escalate',
        message: cleanFormatting(parsed.message),
      });
    }

    const cleanedText = cleanFormatting(aiMessage);

    // If text explicitly suggests creating a ticket or escalating
    const isEscalationText = /create (a )?(support )?ticket|submit (a )?ticket|support ticket below/i.test(cleanedText);

    return res.status(200).json({
      success: true,
      type: isEscalationText ? 'escalate' : 'answer',
      message: cleanedText,
    });
  } catch (error) {
    console.error('Groq API Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to connect to AI service. Please try again.',
    });
  }
};

module.exports = { chat };
