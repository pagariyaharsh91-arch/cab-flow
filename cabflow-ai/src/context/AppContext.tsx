import React, { createContext, useContext, useState, useEffect } from 'react';
import { Booking, DBHealth, Language, NavTab, User, UserRole } from '../types';
import { translations } from '../i18n/translations';
import { api } from '../services/api';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations['en'];
  user: User | null;
  setUser: (u: User | null) => void;
  switchRole: (role: UserRole) => void;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  dbHealth: DBHealth | null;
  refreshHealth: () => Promise<void>;
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  isNewBookingOpen: boolean;
  setIsNewBookingOpen: (open: boolean) => void;
  isRecordPaymentOpen: boolean;
  setIsRecordPaymentOpen: (open: boolean) => void;
  selectedBookingForPayment: Booking | null;
  openRecordPayment: (booking?: Booking) => void;
  isVoiceModalOpen: boolean;
  setIsVoiceModalOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('cabflow_lang');
    return (saved === 'mr' || saved === 'hi' || saved === 'en') ? saved : 'en';
  });

  const [user, setUser] = useState<User | null>({
    id: 'usr-001',
    name: 'Prof. Rajesh Kulkarni',
    email: 'admin@cabflow.ai',
    role: 'admin',
    avatar_url: '/src/assets/images/admin_avatar_1792657023605.jpg',
  });

  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [dbHealth, setDbHealth] = useState<DBHealth | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState<Booking | null>(null);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const t = translations[lang] || translations.en;

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('cabflow_lang', newLang);
  };

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const refreshHealth = async () => {
    try {
      const health = await api.getHealth();
      setDbHealth(health);
    } catch (e) {
      console.warn('Health check error:', e);
    }
  };

  const switchRole = (role: UserRole) => {
    const roleNames: Record<UserRole, { name: string; email: string }> = {
      admin: { name: 'Prof. Rajesh Kulkarni', email: 'admin@cabflow.ai' },
      staff: { name: 'Ananya Deshmukh', email: 'staff@cabflow.ai' },
      viewer: { name: 'Guest Evaluator', email: 'viewer@cabflow.ai' },
    };
    const target = roleNames[role];
    setUser({
      id: role === 'admin' ? 'usr-001' : role === 'staff' ? 'usr-002' : 'usr-003',
      name: target.name,
      email: target.email,
      role,
      avatar_url: role === 'admin' ? '/src/assets/images/admin_avatar_1792657023605.jpg' : null,
    });
    addToast(`Switched active role to ${role.toUpperCase()}`, 'info');
  };

  const openRecordPayment = (booking?: Booking) => {
    setSelectedBookingForPayment(booking || null);
    setIsRecordPaymentOpen(true);
  };

  useEffect(() => {
    refreshHealth();
    // Fetch initial user if exists
    api.getMe().then((res) => {
      if (res?.user) setUser(res.user);
    }).catch(() => {});
  }, [refreshTrigger]);

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        t,
        user,
        setUser,
        switchRole,
        activeTab,
        setActiveTab,
        dbHealth,
        refreshHealth,
        toasts,
        addToast,
        removeToast,
        isNewBookingOpen,
        setIsNewBookingOpen,
        isRecordPaymentOpen,
        setIsRecordPaymentOpen,
        selectedBookingForPayment,
        openRecordPayment,
        isVoiceModalOpen,
        setIsVoiceModalOpen,
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,
        refreshTrigger,
        triggerRefresh,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
