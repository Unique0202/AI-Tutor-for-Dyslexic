// Sends a message to the Express proxy which calls the Groq API (Llama 3).
// Returns { text, offline } so the UI can show when AI is not connected.

const FALLBACK_RESPONSES = {
  read: "Try reading along while a story is read aloud to you — the Reading Adventure game does exactly that.",
  letter: "Mixing up b and d is very common in dyslexia. The brain finds it hard to tell apart letters that look like mirror images. Letter Master can help you practise telling them apart.",
  spell: "In Spell Quest, a word is spoken aloud and you type what you hear. Hints are always available whenever you need them.",
  word: "Word Builder lets you tap letters to build a word you hear — start with the beginner level!",
  dyslexia: "Dyslexia means the brain processes written language differently. It has nothing to do with intelligence — many brilliant people are dyslexic.",
  tip: "Before reading, listen to the text read aloud first. Your brain connects sounds to words much faster that way.",
  help: "I can help with reading and spelling tips, questions about dyslexia, or how to use the games.",
}

function localFallback(text) {
  const t = text.toLowerCase()
  if (t.includes('read'))                         return FALLBACK_RESPONSES.read
  if (t.includes('letter') || t.includes('b and d') || t.includes('d and b')) return FALLBACK_RESPONSES.letter
  if (t.includes('spell'))                        return FALLBACK_RESPONSES.spell
  if (t.includes('word') || t.includes('build'))  return FALLBACK_RESPONSES.word
  if (t.includes('dyslexia') || t.includes('what is')) return FALLBACK_RESPONSES.dyslexia
  if (t.includes('tip') || t.includes('advice') || t.includes('help me')) return FALLBACK_RESPONSES.tip
  return FALLBACK_RESPONSES.help
}

export async function sendMessage(userMessage, history = []) {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userMessage,
        conversationHistory: history.map(m => ({ role: m.role, content: m.content })),
      }),
      signal: AbortSignal.timeout(10000),
    })

    if (!res.ok) throw new Error(`Server error ${res.status}`)

    const data = await res.json()
    return { text: data.response, offline: false }
  } catch {
    // Server not running — use offline keyword fallback
    return { text: localFallback(userMessage), offline: true }
  }
}
