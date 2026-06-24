import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, Volume2, VolumeX, Sparkles, AlertCircle, Loader2, CheckCircle2, HelpCircle } from 'lucide-react';
import { Scene, ChatMessage } from '../types';
import { speakText, stopSpeaking, SpeechRecognitionService } from '../lib/speech';

interface PracticeViewProps {
  scene: Scene;
  onFinish: (conversation: { role: 'ai' | 'user'; text: string }[], rounds: number) => void;
  onCancel: () => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({ scene, onFinish, onCancel }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showHints, setShowHints] = useState(false);

  const recognizerRef = useRef<SpeechRecognitionService | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Initialize first AI message on mount
  useEffect(() => {
    recognizerRef.current = new SpeechRecognitionService();

    const firstMsg: ChatMessage = {
      id: 'msg-0',
      role: 'ai',
      text: scene.aiFirstMessage,
      timestamp: new Date()
    };

    setMessages([firstMsg]);

    if (autoSpeak) {
      setTimeout(() => {
        speakText(firstMsg.text);
      }, 400);
    }

    return () => {
      stopSpeaking();
      recognizerRef.current?.stop();
    };
  }, [scene]);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, interimText, isLoadingAi]);

  // User turn counter (how many user inputs sent)
  const userRoundCount = messages.filter(m => m.role === 'user').length;
  const targetRounds = 6;
  const isGoalReached = userRoundCount >= targetRounds;

  const handleSendUserMessage = async (textToSend?: string) => {
    const text = (textToSend ?? inputText).trim();
    if (!text || isLoadingAi) return;

    if (isListening) {
      recognizerRef.current?.stop();
      setIsListening(false);
      setInterimText('');
    }

    setInputText('');
    setErrorMessage(null);

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      text,
      timestamp: new Date()
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoadingAi(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sceneTitle: scene.title,
          aiRole: scene.aiRole,
          sceneDescription: scene.description,
          messages: newMessages.map(m => ({ role: m.role, text: m.text })),
          userMessage: text
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const aiReplyText = data.reply || "Got it, thanks!";
      const aiMsg: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'ai',
        text: aiReplyText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsg]);

      if (autoSpeak) {
        speakText(aiReplyText);
      }
    } catch (err: any) {
      setErrorMessage(err.message || '网络连接或 AI 请求发生错误');
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleToggleMic = () => {
    if (!recognizerRef.current?.isSupported) {
      setErrorMessage('您的浏览器不支持录音 API，推荐使用电脑端 Chrome 或 Edge 浏览器打开。');
      return;
    }

    if (isListening) {
      recognizerRef.current.stop();
      setIsListening(false);
      if (interimText.trim()) {
        setInputText(interimText);
        setInterimText('');
      }
      return;
    }

    setErrorMessage(null);
    setInterimText('');
    stopSpeaking();

    const started = recognizerRef.current.start({
      onResult: (text, isFinal) => {
        setInterimText(text);
        if (isFinal && text.trim().length > 0) {
          // If final, populate input field
          setInputText(text);
        }
      },
      onError: (err) => {
        setErrorMessage(err);
        setIsListening(false);
      },
      onEnd: () => {
        setIsListening(false);
      }
    });

    if (started) {
      setIsListening(true);
    }
  };

  const handleFinishPractice = () => {
    stopSpeaking();
    recognizerRef.current?.stop();
    const cleanConv = messages.map(m => ({ role: m.role, text: m.text }));
    onFinish(cleanConv, Math.max(1, userRoundCount));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 pb-36 min-h-[calc(100vh-64px)] flex flex-col justify-between animate-fade-in">
      {/* Top Header & Round Indicator */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md pb-4 pt-2 border-b border-slate-200">
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <span className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-xl shrink-0">
              {scene.emoji}
            </span>
            <div className="min-w-0">
              <h2 className="font-bold text-base text-slate-900 truncate">{scene.titleZh}</h2>
              <p className="text-xs text-indigo-600 font-medium truncate">扮演对方：{scene.aiRoleZh}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Auto speak toggle */}
            <button
              onClick={() => {
                const next = !autoSpeak;
                setAutoSpeak(next);
                if (!next) stopSpeaking();
              }}
              title={autoSpeak ? "点击关闭自动发音" : "点击开启自动发音"}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                autoSpeak ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-slate-100 border-slate-200 text-slate-500'
              }`}
            >
              {autoSpeak ? <Volume2 className="w-4 h-4 text-indigo-600" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">{autoSpeak ? "自动朗读开" : "静音模式"}</span>
            </button>

            {/* Finish CTA */}
            <button
              onClick={handleFinishPractice}
              className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-xs flex items-center gap-1.5 ${
                isGoalReached 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white animate-bounce' 
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGoalReached ? "生成反馈点评" : "提前结束分析"}</span>
            </button>
          </div>
        </div>

        {/* Round Progress bar */}
        <div className="flex items-center gap-3 text-xs font-semibold">
          <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${isGoalReached ? 'bg-emerald-500' : 'bg-indigo-600'}`}
              style={{ width: `${Math.min(100, (userRoundCount / targetRounds) * 100)}%` }}
            ></div>
          </div>
          <span className={isGoalReached ? 'text-emerald-600 font-bold' : 'text-slate-500'}>
            对练进度：{userRoundCount} / {targetRounds} 轮
          </span>
        </div>
      </div>

      {/* Goal reached banner */}
      {isGoalReached && (
        <div className="my-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-emerald-900 text-xs sm:text-sm animate-fade-in shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span><strong>棒极了！</strong> 已达到推荐练习轮数，随时可以生成报告。</span>
          </div>
          <button
            onClick={handleFinishPractice}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shrink-0 cursor-pointer shadow-2xs"
          >
            立即点评 →
          </button>
        </div>
      )}

      {/* Error message Toast */}
      {errorMessage && (
        <div className="my-3 p-3 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs sm:text-sm flex items-center justify-between animate-shake">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="font-bold underline text-xs cursor-pointer">关闭</button>
        </div>
      )}

      {/* Chat Messages List */}
      <div className="flex-1 space-y-4 py-4">
        {messages.map((msg) => {
          const isAi = msg.role === 'ai';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isAi ? 'items-start' : 'items-end'} animate-fade-in`}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1">
                <span className="text-[11px] font-semibold text-slate-400">
                  {isAi ? `🤖 ${scene.aiRoleZh}` : '👤 你'}
                </span>
              </div>

              <div className={`relative max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 sm:p-5 shadow-xs ${
                isAi 
                  ? 'bg-slate-100 text-slate-800 rounded-tl-xs border border-slate-200/80' 
                  : 'bg-indigo-600 text-white rounded-tr-xs shadow-indigo-200'
              }`}>
                {/* Manual TTS button for this bubble */}
                <button
                  onClick={() => speakText(msg.text)}
                  className={`absolute top-3 ${isAi ? 'right-3' : 'left-3 -ml-10 sm:-ml-12'} p-1.5 rounded-lg transition-all cursor-pointer ${
                    isAi 
                      ? 'bg-white hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 border border-slate-200 shadow-2xs' 
                      : 'bg-white/20 hover:bg-white text-white hover:text-indigo-600'
                  }`}
                  title="重新发音"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>

                <p className={`text-sm sm:text-base leading-relaxed whitespace-pre-wrap ${isAi ? 'pr-8' : ''}`}>
                  {msg.text}
                </p>
              </div>
            </div>
          );
        })}

        {/* AI Typing Spinner */}
        {isLoadingAi && (
          <div className="flex flex-col items-start animate-fade-in">
            <span className="text-[11px] font-semibold text-slate-400 mb-1 px-1">🤖 {scene.aiRoleZh} 正在回复...</span>
            <div className="bg-slate-100 rounded-2xl rounded-tl-xs p-4 border border-slate-200 flex items-center gap-2 text-slate-500 text-sm font-medium">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              <span>对方正在思考组织语言...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Hints Drawer / Expand */}
      {showHints && (
        <div className="my-2 p-4 bg-purple-50 border border-purple-200 rounded-2xl animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-xs text-purple-900 flex items-center gap-1">
              💡 可以试着这样回复：
            </span>
            <button onClick={() => setShowHints(false)} className="text-xs text-purple-700 underline cursor-pointer">隐藏提示</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {scene.hints.map((hint, i) => (
              <button
                key={i}
                onClick={() => setInputText(hint)}
                className="px-3 py-1.5 bg-white hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-xl text-xs font-medium text-left cursor-pointer transition-colors shadow-2xs"
              >
                "{hint}"
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Sticky Input Area */}
      <div className="fixed bottom-0 left-0 right-0 p-3 sm:p-4 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-xl z-40">
        <div className="max-w-4xl mx-auto">
          {/* Interim speech wave indicator */}
          {isListening && (
            <div className="mb-2.5 p-2.5 bg-indigo-600 text-white rounded-xl flex items-center justify-between text-xs animate-pulse shadow-md">
              <div className="flex items-center gap-2 truncate">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping"></span>
                <span className="font-bold">正在录音识别...</span>
                <span className="italic truncate">{interimText || '请对着麦克风清晰说话...'}</span>
              </div>
              <button onClick={handleToggleMic} className="px-2 py-0.5 bg-white/20 hover:bg-white text-white hover:text-indigo-600 font-bold rounded cursor-pointer shrink-0">
                完成说好了
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            {/* Hint CTA */}
            <button
              onClick={() => setShowHints(!showHints)}
              title="查看推荐回复锦囊"
              className={`p-3 rounded-2xl border transition-colors cursor-pointer shrink-0 ${
                showHints ? 'bg-purple-600 text-white border-purple-600' : 'bg-slate-100 hover:bg-purple-50 text-slate-600 hover:text-purple-600 border-slate-200'
              }`}
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            {/* Mic Button */}
            <button
              onClick={handleToggleMic}
              disabled={isLoadingAi}
              title={isListening ? "点击停止录音" : "点击麦克风语音输入"}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer shrink-0 flex items-center justify-center ${
                isListening 
                  ? 'bg-red-500 text-white border-red-600 shadow-lg shadow-red-300 animate-pulse scale-105' 
                  : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border-indigo-200 shadow-2xs'
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Text Input */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendUserMessage();
                }
              }}
              placeholder={isListening ? "正在将您的语音转为文字..." : "输入英文回复，或点击左侧麦克风说话..."}
              disabled={isLoadingAi}
              className="flex-1 bg-slate-50 border border-slate-300 focus:border-indigo-600 focus:bg-white px-4 py-3.5 rounded-2xl text-sm sm:text-base outline-none transition-all shadow-inner"
            />

            {/* Send Button */}
            <button
              onClick={() => handleSendUserMessage()}
              disabled={!inputText.trim() || isLoadingAi}
              className="p-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold transition-all cursor-pointer shrink-0 shadow-md shadow-indigo-200 active:scale-95 flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
