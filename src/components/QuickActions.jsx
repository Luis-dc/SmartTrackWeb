function QuickActions({ actions = [], onSelect, disabled = false }) {
  if (!actions.length) return null

  return (
    <div className="chatbot-actions-row">
      {actions.map((action) => (
        <button
          key={action}
          type="button"
          className="chatbot-action-pill"
          onClick={() => onSelect(action)}
          disabled={disabled}
        >
          {action}
        </button>
      ))}
    </div>
  )
}

export default QuickActions