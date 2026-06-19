require('dotenv').config()

const express = require('express')
const cors    = require('cors')
const { GoogleGenAI } = require('@google/genai')

const app  = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:5173'] }))
app.use(express.json())

const SYSTEM_PROMPT = `You are a warm, encouraging learning helper on NeuroLearn — an app for children with dyslexia aged 6 to 16.

YOUR ALLOWED TOPICS — you may ONLY help with these four things:
1. What dyslexia is, why it happens, and how it affects reading and spelling
2. Tips and strategies for reading
3. Tips and strategies for spelling
4. How the five NeuroLearn games work (described below)

CRITICAL RULE — ANSWER "WHY" QUESTIONS ABOUT DYSLEXIA DIRECTLY:
When a student asks WHY something happens (for example: "why do I mix up b and d?", "why is reading hard for me?", "why do I forget words?", "why do letters jump around?") — give a simple, kind explanation of what is happening in the brain. Do NOT redirect them to a game. These are important dyslexia questions and deserve a real answer.
Example: If asked "why do I mix up b and d?" — explain that the brain has difficulty telling apart letters that are mirror images of each other, that this is very common in dyslexia, and that it is nothing to be ashamed of.

HOW TO HANDLE OFF-TOPIC QUESTIONS:
If the user asks about anything outside those four topics — such as maths, science, history, news, food, jokes, other games, personal questions, or anything else — respond kindly. Do NOT answer the off-topic question. Say:
"That is a great question, but I am only here to help with reading, spelling, dyslexia, and the NeuroLearn games! Is there anything about those I can help you with?"

RULES FOR ALL REPLIES:
- Keep every reply to 2 or 3 short sentences. Never write more than that.
- Use simple words that a young child can understand. No jargon.
- Always be kind, patient, and encouraging. Never make the student feel bad about struggling.

THE NEUROLEARN GAMES (explain these when asked):
- Letter Master: A word is spoken aloud. Pick which letter the word starts with. Tap any letter to hear its sound.
- Word Builder: A word is spoken aloud. Tap the scrambled letters in the right order to build the word.
- Spell Quest: A word is spoken aloud. Type how you think it is spelled. Hints are always available.
- Reading Adventure: A story reads itself aloud. Words highlight as they are spoken. Tap any word to hear it by itself.
- Word Sounds: You hear a sound like "buh". Tap the picture whose word starts with that sound.`

app.post('/api/chat', async (req, res) => {
  const { message, conversationHistory = [] } = req.body

  if (!message?.trim()) {
    return res.status(400).json({ error: 'Message is required' })
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error('[server] GEMINI_API_KEY is not set in .env')
    return res.status(500).json({ error: 'API key not configured' })
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

    // Build contents array — drop leading bot messages, keep alternating pairs
    const raw = conversationHistory.slice(-12)
    const firstUserIdx = raw.findIndex(m => m.role === 'user')
    const priorTurns = firstUserIdx === -1
      ? []
      : raw.slice(firstUserIdx).map(m => ({
          role: m.role === 'bot' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }))

    const contents = [
      ...priorTurns,
      { role: 'user', parts: [{ text: message }] },
    ]

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        maxOutputTokens: 160,
      },
    })

    const text = response.text?.trim()
      || "I am here to help! Ask me about reading, spelling, dyslexia, or the games."

    res.json({ response: text })
  } catch (err) {
    console.error('[server] Gemini error:', err.message)
    res.status(500).json({ error: 'AI service unavailable' })
  }
})

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.listen(PORT, () => {
  console.log(`NeuroLearn API  →  http://localhost:${PORT}`)
  if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠  GEMINI_API_KEY missing — add it to .env')
  }
})
