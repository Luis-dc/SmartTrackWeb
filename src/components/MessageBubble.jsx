function renderFormattedText(text = '') {
  const lines = text.split('\n')

  return lines.map((line, lineIndex) => {
    const parts = line.split(/(\*\*.*?\*\*)/g)

    return (
      <div key={lineIndex}>
        {parts.map((part, partIndex) => {
          const isBold = /^\*\*.*\*\*$/.test(part)

          if (isBold) {
            return (
              <strong key={partIndex}>
                {part.slice(2, -2)}
              </strong>
            )
          }

          return <span key={partIndex}>{part}</span>
        })}
      </div>
    )
  })
}

function MessageBubble({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`d-flex mb-3 ${isUser ? 'justify-content-end' : 'justify-content-start'}`}>
      <div className={`message-bubble ${isUser ? 'message-user' : 'message-bot'}`}>
        <div className="message-author">
          {isUser ? 'Tú' : 'SmartTrack Bot'}
        </div>

        <div className="message-text">
          {renderFormattedText(message.text)}
        </div>

        {message.links?.length > 0 && (
          <div className="d-flex flex-wrap gap-2 mt-3">
            {message.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-light border rounded-pill"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MessageBubble