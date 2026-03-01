// import OpenAI from 'openai'

const pending = {}
let next = 0n

// works
function poll(handle) {
  const work = pending[handle]
  console.log('!! poll', handle, work)
  if (!work) {
    return JSON.stringify({ error: `No handle ${handle}` })
  } else if (work instanceof Promise) {
    return 'delay'
  } else {
    delete pending[handle]
    return JSON.stringify(work)
  }
}

async function fetchNative(url, apiKey, body) {
  const headers = { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' }
  console.log('!! fetch', url)
  // arrives here
  const reply = await fetch(url, { method: 'POST', headers, body })
  // never arrives here
  console.log('!! fetch !! reply', url)
  if (!reply.ok) { return { error: `HTTP ${reply.status}` } }
  return reply.json()
}

function chatCompletion(apiKey, json) {
  const handle = next++
  const work = () => {
    console.log('!! begin', handle)
    const url = 'https://api.openai.com/v1/chat/completions'
    return fetchNative(url, apiKey, json)
  }
  const cleanup = () => {
    console.log('!! cleanup')
    setTimeout(() => delete pending[handle], 5_000)
    // never arrives here
  }

  pending[handle] = work().then((obj) => {
    console.log('!! resolve')
    pending[handle] = obj
    // never arrives here
  }).catch((err) => {
    console.log('!! reject')
    pending[handle] = { error: err.message }
    // never arrives here
  }).finally(cleanup)
  return handle
}

export const helpersInterface = {
  poll,
  chatCompletion,
}
