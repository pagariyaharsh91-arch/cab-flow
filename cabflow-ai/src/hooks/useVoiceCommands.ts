import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Language } from '../types';
import { api } from '../services/api';

export interface CommandAction {
  label: string;
  type: 'navigate' | 'modal' | 'language' | 'search' | 'action';
  execute: () => void;
  requiresConfirmation?: boolean;
}

export function useVoiceCommands() {
  const { lang, setLang, setActiveTab, setIsNewBookingOpen, setSearchQuery, setIsSearchOpen, addToast, triggerRefresh } =
    useApp();
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [voiceLang, setVoiceLang] = useState<string>(() => {
    if (lang === 'mr') return 'mr-IN';
    if (lang === 'hi') return 'hi-IN';
    return 'en-IN';
  });
  const [pendingAction, setPendingAction] = useState<CommandAction | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  // Sync voice language when global language changes
  useEffect(() => {
    if (lang === 'mr') setVoiceLang('mr-IN');
    else if (lang === 'hi') setVoiceLang('hi-IN');
    else setVoiceLang('en-IN');
  }, [lang]);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = voiceLang;

      recognition.onstart = () => {
        setIsListening(true);
        setPermissionError(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setRecognizedText(transcript);

        if (event.results[0].isFinal) {
          processCommand(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setPermissionError('Microphone permission was denied. Please allow microphone access or use text input.');
        } else if (event.error === 'no-speech') {
          // just timeout
        } else {
          setPermissionError(`Speech recognition: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (err: any) {
      setIsSupported(false);
      console.warn('SpeechRecognition initialization failed:', err);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, [voiceLang]);

  const speakFeedback = (text: string, languageCode: string) => {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = languageCode;
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        // graceful ignore
      }
    }
  };

  const processCommand = (rawText: string) => {
    const text = rawText.toLowerCase().trim();
    let action: CommandAction | null = null;

    // --- English Commands ---
    if (text.includes('dashboard') || text.includes('डॅशबोर्ड') || text.includes('डैशबोर्ड')) {
      action = {
        label: 'Open Dashboard',
        type: 'navigate',
        execute: () => {
          setActiveTab('dashboard');
          speakFeedback('Opening dashboard', voiceLang);
        },
      };
    } else if (
      text.includes('all booking') ||
      text.includes('show bookings') ||
      text.includes('open bookings') ||
      text.includes('बुकिंग दाखवा') ||
      text.includes('सर्व बुकिंग') ||
      text.includes('बुकिंग दिखाओ') ||
      text.includes('सभी बुकिंग')
    ) {
      action = {
        label: 'Show Bookings',
        type: 'navigate',
        execute: () => {
          setActiveTab('bookings');
          speakFeedback('Showing bookings', voiceLang);
        },
      };
    } else if (
      text.includes('new booking') ||
      text.includes('create booking') ||
      text.includes('book a cab') ||
      text.includes('नवीन बुकिंग') ||
      text.includes('बुकिंग तयार करा') ||
      text.includes('नई बुकिंग') ||
      text.includes('कैब बुक करो')
    ) {
      action = {
        label: 'Open Booking Form',
        type: 'modal',
        requiresConfirmation: true,
        execute: () => {
          setIsNewBookingOpen(true);
          speakFeedback('Opening booking form', voiceLang);
        },
      };
    } else if (
      text.includes('cabs') ||
      text.includes('fleet') ||
      text.includes('vehicles') ||
      text.includes('available cabs') ||
      text.includes('उपलब्ध गाड्या') ||
      text.includes('वाहन') ||
      text.includes('गाड़ियां') ||
      text.includes('फ्लीट')
    ) {
      action = {
        label: 'Show Fleet Management',
        type: 'navigate',
        execute: () => {
          setActiveTab('fleet');
          speakFeedback('Showing fleet', voiceLang);
        },
      };
    } else if (
      text.includes('drivers') ||
      text.includes('चालक') ||
      text.includes('ड्रायव्हर्स') ||
      text.includes('ड्राइवर्स')
    ) {
      action = {
        label: 'Show Drivers',
        type: 'navigate',
        execute: () => {
          setActiveTab('drivers');
          speakFeedback('Showing drivers', voiceLang);
        },
      };
    } else if (
      text.includes('customers') ||
      text.includes('customer') ||
      text.includes('ग्राहक')
    ) {
      action = {
        label: 'Show Customers',
        type: 'navigate',
        execute: () => {
          setActiveTab('customers');
          speakFeedback('Showing customers', voiceLang);
        },
      };
    } else if (
      text.includes('payments') ||
      text.includes('pending payments') ||
      text.includes('पेमेंट') ||
      text.includes('भुगतान')
    ) {
      action = {
        label: 'Show Payments',
        type: 'navigate',
        execute: () => {
          setActiveTab('payments');
          speakFeedback('Showing payments', voiceLang);
        },
      };
    } else if (
      text.includes('reports') ||
      text.includes('analytics') ||
      text.includes('अहवाल') ||
      text.includes('रिपोर्ट्स')
    ) {
      action = {
        label: 'Show Reports & Analytics',
        type: 'navigate',
        execute: () => {
          setActiveTab('reports');
          speakFeedback('Showing reports', voiceLang);
        },
      };
    } else if (
      text.includes('activity') ||
      text.includes('logs') ||
      text.includes('नोंदी') ||
      text.includes('लॉग')
    ) {
      action = {
        label: 'Show Activity Logs',
        type: 'navigate',
        execute: () => {
          setActiveTab('activity');
          speakFeedback('Showing activity logs', voiceLang);
        },
      };
    } else if (
      text.includes('settings') ||
      text.includes('सेटिंग्ज') ||
      text.includes('सेटिंग्स')
    ) {
      action = {
        label: 'Open Settings',
        type: 'navigate',
        execute: () => {
          setActiveTab('settings');
          speakFeedback('Opening settings', voiceLang);
        },
      };
    } else if (
      text.includes('marathi') ||
      text.includes('मराठी')
    ) {
      action = {
        label: 'Change Language to Marathi',
        type: 'language',
        execute: () => {
          setLang('mr');
          speakFeedback('भाषा मराठी केली आहे', 'mr-IN');
        },
      };
    } else if (
      text.includes('hindi') ||
      text.includes('हिंदी')
    ) {
      action = {
        label: 'Change Language to Hindi',
        type: 'language',
        execute: () => {
          setLang('hi');
          speakFeedback('भाषा हिंदी कर दी गई है', 'hi-IN');
        },
      };
    } else if (
      text.includes('english') ||
      text.includes('इंग्रजी') ||
      text.includes('अंग्रेजी')
    ) {
      action = {
        label: 'Change Language to English',
        type: 'language',
        execute: () => {
          setLang('en');
          speakFeedback('Language changed to English', 'en-IN');
        },
      };
    } else if (text.startsWith('search for') || text.startsWith('search') || text.includes('शोधा') || text.includes('खोजो')) {
      const query = text.replace(/search for|search|शोधा|खोजो/gi, '').trim();
      action = {
        label: `Search "${query}"`,
        type: 'search',
        execute: () => {
          setSearchQuery(query);
          setIsSearchOpen(true);
          speakFeedback(`Searching for ${query}`, voiceLang);
        },
      };
    } else if (text.includes('demo data') || text.includes('seed') || text.includes('डेमो डेटा')) {
      action = {
        label: 'Reload Demo Dataset',
        type: 'action',
        requiresConfirmation: true,
        execute: async () => {
          try {
            await api.seedDemo();
            triggerRefresh();
            addToast('Demo dataset reloaded successfully', 'success');
            speakFeedback('Demo dataset loaded', voiceLang);
          } catch (e: any) {
            addToast(e.message || 'Failed to reload demo data', 'error');
          }
        },
      };
    }

    if (action) {
      if (action.requiresConfirmation) {
        setPendingAction(action);
      } else {
        action.execute();
        addToast(`Voice Command: "${rawText}" → ${action.label}`, 'info');
      }
    } else {
      addToast(`Command not recognized: "${rawText}". Try "Open dashboard", "Show bookings", or "Change language to Hindi"`, 'error');
    }
  };

  const startListening = () => {
    if (!recognitionRef.current) return;
    setRecognizedText('');
    setPermissionError(null);
    try {
      recognitionRef.current.lang = voiceLang;
      recognitionRef.current.start();
    } catch (e) {
      console.warn('Already listening or starting:', e);
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch (e) {}
    setIsListening(false);
  };

  const confirmPendingAction = () => {
    if (pendingAction) {
      pendingAction.execute();
      addToast(`Executed: ${pendingAction.label}`, 'success');
      setPendingAction(null);
    }
  };

  const cancelPendingAction = () => {
    setPendingAction(null);
  };

  return {
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
  };
}
