import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useVoiceCommands } from '../hooks/useVoiceCommands';
import { Mic, MicOff, Volume2, X, AlertCircle, CheckCircle, ArrowRight, CornerDownLeft } from 'lucide-react';

export const VoiceCommandModal: React.FC = () => {
  const { isVoiceModalOpen, setIsVoiceModalOpen, t } = useApp();
  const {
    isListening,
    recognizedText,
    setRecognizedText,
    voiceLang,
    setVoiceLang,
    startListening,
    stopListening,
    processCommand,
    pendingAction,
    confirmPendingAction,
    cancelPendingAction,
    isSupported,
    permissionError,
  } = useVoiceCommands();

  const [manualText, setManualText] = useState('');

  if (!isVoiceModalOpen) return null;

  const sampleCommandsByLang: Record<string, string[]> = {
    'en-IN': [
      'Open dashboard',
      'Show all bookings',
      'Create a new booking',
      'Show available cabs',
      'Show pending payments',
      'Show reports',
      'Change language to Marathi',
      'Change language to Hindi',
    ],
    'mr-IN': [
      'डॅशबोर्ड उघडा',
      'सर्व बुकिंग दाखवा',
      'नवीन बुकिंग तयार करा',
      'उपलब्ध गाड्या दाखवा',
      'प्रलंबित पेमेंट दाखवा',
      'भाषा हिंदी करा',
      'भाषा इंग्रजी करा',
    ],
    'hi-IN': [
      'डैशबोर्ड खोलो',
      'सभी बुकिंग दिखाओ',
      'नई बुकिंग बनाओ',
      'उपलब्ध गाड़ियाँ दिखाओ',
      'पेंडिंग पेमेंट दिखाओ',
      'भाषा मराठी करो',
      'भाषा अंग्रेजी करो',
    ],
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualText.trim()) return;
    processCommand(manualText.trim());
    setManualText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-600 rounded-lg text-white">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base">{t.voice.title}</h3>
              <p className="text-xs text-slate-300">Web Speech API & Natural Command Parser</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopListening();
              setIsVoiceModalOpen(false);
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Language selector for Voice */}
          <div className="flex items-center justify-between text-xs text-slate-600 pb-2 border-b border-slate-100">
            <span className="font-medium text-slate-700">{t.voice.language}:</span>
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setVoiceLang('en-IN')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  voiceLang === 'en-IN' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                English (en-IN)
              </button>
              <button
                type="button"
                onClick={() => setVoiceLang('mr-IN')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  voiceLang === 'mr-IN' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                मराठी (mr-IN)
              </button>
              <button
                type="button"
                onClick={() => setVoiceLang('hi-IN')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  voiceLang === 'hi-IN' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                हिन्दी (hi-IN)
              </button>
            </div>
          </div>

          {/* Microphone Action Area */}
          <div className="flex flex-col items-center justify-center py-6 px-4 bg-slate-50/80 rounded-xl border border-slate-100">
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`relative group flex items-center justify-center w-20 h-20 rounded-full transition-all duration-300 focus:outline-hidden ${
                isListening
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 ring-8 ring-rose-100 animate-pulse'
                  : 'bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/20'
              }`}
            >
              {isListening ? <Mic className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </button>

            <p className="mt-4 text-sm font-medium text-slate-800">
              {isListening ? `${t.voice.listening} ${voiceLang}...` : t.voice.tapToSpeak}
            </p>

            {recognizedText && (
              <div className="mt-3 px-4 py-2 bg-white rounded-lg border border-purple-200 text-purple-900 text-sm font-medium text-center shadow-xs max-w-md">
                "{recognizedText}"
              </div>
            )}
          </div>

          {/* Permission warning or unsupported note */}
          {(!isSupported || permissionError) && (
            <div className="flex items-start gap-3 p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <p className="font-semibold">Speech Recognition Note</p>
                <p className="mt-0.5 text-amber-800">
                  {permissionError || t.voice.unsupported} You can use the fallback text box below to run any voice command directly.
                </p>
              </div>
            </div>
          )}

          {/* Action Confirmation Banner */}
          {pendingAction && (
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 text-purple-950 space-y-3">
              <div className="flex items-center gap-2 font-semibold text-sm">
                <AlertCircle className="w-4 h-4 text-purple-600" />
                <span>{t.voice.confirmAction}: {pendingAction.label}</span>
              </div>
              <p className="text-xs text-purple-800">
                {t.voice.confirmMessage}
              </p>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={cancelPendingAction}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  {t.voice.cancel}
                </button>
                <button
                  type="button"
                  onClick={confirmPendingAction}
                  className="px-3.5 py-1.5 text-xs font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 shadow-xs"
                >
                  {t.voice.yesProceed}
                </button>
              </div>
            </div>
          )}

          {/* Text Command Fallback */}
          <form onSubmit={handleManualSubmit} className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Text Command Fallback</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                placeholder={t.voice.typeCommand}
                className="flex-1 px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors shrink-0 flex items-center gap-1.5"
              >
                <span>{t.voice.submit}</span>
                <CornerDownLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Sample Command Chips */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-600">{t.voice.tryCommands}</span>
            <div className="flex flex-wrap gap-1.5">
              {(sampleCommandsByLang[voiceLang] || sampleCommandsByLang['en-IN']).map((cmd, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setRecognizedText(cmd);
                    processCommand(cmd);
                  }}
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 border border-slate-200 rounded-lg text-slate-700 transition-colors"
                >
                  "{cmd}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Supported browsers: Chrome, Edge, Safari</span>
          <button
            type="button"
            onClick={() => {
              stopListening();
              setIsVoiceModalOpen(false);
            }}
            className="font-medium text-slate-700 hover:text-slate-900"
          >
            {t.voice.close}
          </button>
        </div>
      </div>
    </div>
  );
};
