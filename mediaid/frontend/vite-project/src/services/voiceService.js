// Voice Assistant Service
const synthesis = window.speechSynthesis || null;
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
export const voiceSupported = !!SpeechRecognition;

let recognition = null;
if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
}

export function speak(text, langCode = 'en-US') {
  if (!synthesis) return;
  synthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = langCode;
  const voices = synthesis.getVoices();
  const langVoice = voices.find(v => v.lang.startsWith(langCode.split('-')[0]));
  if (langVoice) utterance.voice = langVoice;
  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.volume = 1;
  synthesis.speak(utterance);
}

export function startListening(langCode, onResult, onError, onEnd) {
  if (!recognition) return false;
  recognition.lang = langCode;
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };
  recognition.onerror = (event) => {
    onError(event.error);
  };
  recognition.onend = onEnd;
  try {
    recognition.start();
    return true;
  } catch (e) {
    return false;
  }
}

export function stopListening() {
  if (recognition) recognition.stop();
}

// Init voices
if (synthesis && synthesis.onvoiceschanged !== undefined) {
  synthesis.onvoiceschanged = () => {};
}
