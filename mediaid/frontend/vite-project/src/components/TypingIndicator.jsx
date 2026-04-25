export default function TypingIndicator() {
  return (
    <div className="msg bot">
      <div className="msg-ava">🩺</div>
      <div className="msg-body">
        <div className="typing-wrap">
          <span className="typing-label">PROCESSING</span>
          <div className="typing-dots">
            <div className="t-dot"></div>
            <div className="t-dot"></div>
            <div className="t-dot"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
