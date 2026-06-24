// Web Speech API Utilities

export function speakText(text: string, rate: number = 0.95): Promise<void> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser.');
      resolve();
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = rate;

    // Try to find a good natural US English voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Daniel'))
    ) || voices.find(v => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.speak(utterance);
  });
}

export function stopSpeaking(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export interface RecognitionHandler {
  onResult: (text: string, isFinal: boolean) => void;
  onError: (err: string) => void;
  onEnd: () => void;
}

export class SpeechRecognitionService {
  private recognition: any = null;
  private isListening: boolean = false;

  constructor() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'en-US';
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
    }
  }

  public get isSupported(): boolean {
    return this.recognition !== null;
  }

  public start(handler: RecognitionHandler): boolean {
    if (!this.recognition) {
      handler.onError('您的浏览器不支持语音识别，请使用 Chrome 或 Edge 浏览器。');
      return false;
    }

    if (this.isListening) {
      this.stop();
    }

    let finalTranscript = '';

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      handler.onResult(finalTranscript || interimTranscript, finalTranscript.length > 0);
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      let errorMsg = '语音识别失败，请检查麦克风权限或尝试直接打字输入。';
      if (event.error === 'not-allowed' || event.error === 'permission-denied') {
        errorMsg = '麦克风权限被拒绝。请在浏览器地址栏中开启麦克风权限。';
      } else if (event.error === 'no-speech') {
        errorMsg = '未检测到声音，请重试或靠近麦克风。';
      }
      handler.onError(errorMsg);
      this.isListening = false;
    };

    this.recognition.onend = () => {
      this.isListening = false;
      handler.onEnd();
    };

    try {
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (e: any) {
      console.error('Failed to start recognition', e);
      handler.onError('启动语音录制失败，请尝试打字输入。');
      return false;
    }
  }

  public stop(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
      this.isListening = false;
    }
  }
}
