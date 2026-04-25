import { voiceSupported } from '../services/voiceService';

export default function VoiceAssistant({ isListening, onToggle }) {
  return (
    <button
      className={`voice-btn${isListening ? ' listening' : ''}`}
      id="voiceBtn"
      onClick={onToggle}
      title={voiceSupported ? 'Voice Assistant' : 'Voice not supported in this browser'}
    >
      {isListening ? '⏺' : '🎤'}
    </button>
  );
}
