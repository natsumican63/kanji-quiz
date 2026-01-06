let context: AudioContext | null = null;

const getContext = (): AudioContext => {
  if (!context) {
    context = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return context;
};

const playCorrect = () => {
  const ctx = getContext();
  const osc1 = ctx.createOscillator();
  const gain = ctx.createGain();
  osc1.type = 'triangle';
  osc1.frequency.setValueAtTime(523.25, ctx.currentTime);
  osc1.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.1);
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
  osc1.connect(gain);
  gain.connect(ctx.destination);
  osc1.start();
  osc1.stop(ctx.currentTime + 0.3);
};

const playWrong = () => {
  const ctx = getContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(110, ctx.currentTime);
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.05);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.4);
};

const playFinish = () => {
  const ctx = getContext();
  const notes = [523.25, 659.25, 783.99, 1046.50];
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
    gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.1);
    gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + i * 0.1 + 0.05);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + i * 0.1 + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + i * 0.1);
    osc.stop(ctx.currentTime + i * 0.1 + 0.4);
  });
};

const speak = (text: string) => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ja-JP';
  utterance.rate = 0.9;
  utterance.pitch = 1.2;
  window.speechSynthesis.speak(utterance);
};

export const AudioService = {
  playCorrect,
  playWrong,
  playFinish,
  speak,
};
