const Groq = require('groq-sdk')

const SYSTEM_PROMPT = `You are a warm, encouraging learning helper on NeuroLearn — an app for children with dyslexia aged 6 to 16.

YOUR ALLOWED TOPICS — you may ONLY help with these four things:
1. What dyslexia is, why it happens, and how it affects reading and spelling
2. Tips and strategies for reading
3. Tips and strategies for spelling
4. How the five NeuroLearn games work (described below)

CRITICAL RULE — ANSWER "WHY" QUESTIONS ABOUT DYSLEXIA DIRECTLY:
When a student asks WHY something happens — for example "why do I mix up b and d?", "why is reading hard for me?", "why do I forget words?", "how can I tell if someone is dyslexic?" — give a simple, kind explanation. Do NOT redirect them to a game. These are important questions and deserve a real answer.

HOW TO HANDLE OFF-TOPIC QUESTIONS:
If the user asks about anything outside those four topics — maths, science, history, news, food, jokes, other games, personal questions, or anything else — respond kindly but do NOT answer. Say:
"That is a great question, but I am only here to help with reading, spelling, dyslexia, and the NeuroLearn games! Is there anything about those I can help you with?"

RULES FOR ALL REPLIES:
- Keep every reply to 2 or 3 short sentences. Never write more than that.
- Use simple words a young child can understand. No jargon.
- Always be kind, patient, and encouraging. Never make the student feel bad about struggling.

THE NEUROLEARN GAMES (explain these when asked):
- Letter Master: A word is spoken aloud. Pick which letter the word starts with. Tap any letter to hear its sound.
- Word Builder: A word is spoken aloud. Tap the scrambled letters in the right order to build the word.
- Spell Quest: A word is spoken aloud. Type how you think it is spelled. Hints are always available.
- Reading Adventure: A story reads itself aloud. Words highlight as they are spoken. Tap any word to hear it by itself.
- Word Sounds: You hear a sound like "buh". Tap the picture whose word starts with that sound.`

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { message, conversationHistory = [] } = req.body

  if (!message?.trim()) return res.status(400).json({ error: 'Message is required' })

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

    const raw = conversationHistory.slice(-12)
    const firstUserIdx = raw.findIndex(m => m.role === 'user')
    const priorTurns = firstUserIdx === -1
      ? []
      : raw.slice(firstUserIdx).map(m => ({
          role: m.role === 'bot' ? 'assistant' : 'user',
          content: m.content,
        }))

    const response = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...priorTurns,
        { role: 'user', content: message },
      ],
      max_tokens: 160,
      temperature: 0.7,
    })

    const text = response.choices[0]?.message?.content?.trim()
      || "I am here to help! Ask me about reading, spelling, dyslexia, or the games."

    res.status(200).json({ response: text })
  } catch (err) {
    console.error('[api/chat] Groq error:', err.message)
    res.status(500).json({ error: 'AI service unavailable' })
  }
}
