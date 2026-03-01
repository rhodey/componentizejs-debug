// import OpenAI from 'openai'

async function fetchNative(url, apiKey, body) {
  const headers = { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' }
  console.log('!! fetch', url)
  const reply = await fetch(url, { method: 'POST', headers, body })
  console.log('!! fetch !! reply', url)
  if (!reply.ok) { throw new Error(`HTTP ${reply.status}`) }
  console.log('!! fetch !! reply !! ok', url)
  return reply.text()
}

async function chatCompletion(apiKey, json) {
  try {
    const url = 'https://api.openai.com/v1/chat/completions'
    const text = await fetchNative(url, apiKey, json)
    return text
  } catch (err) {
    return JSON.stringify({ error: err.message })
  }
}

export const helpersInterface = {
  chatCompletion,
}
