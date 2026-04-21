function generateId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  }
  
  export function getOrCreateSession() {
    let userId = localStorage.getItem('smarttrack_user_id')
    let conversationId = localStorage.getItem('smarttrack_conversation_id')
  
    if (!userId) {
      userId = generateId('web-user')
      localStorage.setItem('smarttrack_user_id', userId)
    }
  
    if (!conversationId) {
      conversationId = generateId('web-conv')
      localStorage.setItem('smarttrack_conversation_id', conversationId)
    }
  
    return {
      userId,
      conversationId
    }
  }
  
  export function resetSession() {
    const userId = generateId('web-user')
    const conversationId = generateId('web-conv')
  
    localStorage.setItem('smarttrack_user_id', userId)
    localStorage.setItem('smarttrack_conversation_id', conversationId)
  
    return {
      userId,
      conversationId
    }
  }