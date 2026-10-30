import React from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { UserRole } from '../types';
import {
  Settings,
  Database,
  Globe,
  Shield,
  Sparkles,
  RefreshCw,
  CheckCircle,
  Copy,
  ExternalLink,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { t, lang, setLang, user, switchRole, dbHealth, addToast, triggerRefresh } = useApp();

  const handleSeed = async () => {
    try {
      const res = await api.seedDemo();
      addToast(res.message, 'success');
      triggerRefresh();
    } catch (e: any) {
      addToast(e.message || 'Failed to seed data', 'error');
    }
  };

  const handleClear = async () => {
    if (user?.role === 'viewer') {
      addToast('Viewers cannot clear data.', 'error');
      return;
    }
    if (!window.confirm('Reset database to clean empty state?')) return;
    try {
      const res = await api.clearDemo();
      addToast(res.message, 'info');
      triggerRefresh();
    } catch (e: any) {
      addToast(e.message || 'Failed to clear data', 'error');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addToast('Copied to clipboard!', 'info');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          {t.settings.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {t.settings.subtitle}
        </p>
      </div>

      {/* Database Connection Panel */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-100 rounded-xl text-purple-700">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                {t.settings.aivenConfig}
              </h3>
              <p className="text-xs text-slate-400">Persistent MySQL 8.0+ / Aiven Cloud Connectivity</p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${
              dbHealth?.isConnectedToMySQL
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-purple-50 text-purple-700 border-purple-200'
            }`}
          >
            {dbHealth?.engine || 'Local Persistent Engine'}
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          {t.settings.aivenDesc}
        </p>

        {/* Connection Parameters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs font-mono">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Host</span>
            <span className="text-slate-900 font-semibold">{dbHealth?.dbHost || 'mysql-service-cabflow.aivencloud.com'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Port</span>
            <span className="text-slate-900 font-semibold">14520 (SSL required)</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Database</span>
            <span className="text-slate-900 font-semibold">defaultdb / cabflow_db</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Driver / Protocol</span>
            <span className="text-purple-700 font-semibold">mysql2 parameterized TLS</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() =>
              copyToClipboard(`DB_HOST="mysql-service-cabflow.aivencloud.com"\nDB_PORT="14520"\nDB_NAME="defaultdb"\nDB_USER="avnadmin"\nDB_PASS="YOUR_PASSWORD"`)
            }
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <Copy className="w-3.5 h-3.5 text-slate-500" />
            <span>Copy .env Template</span>
          </button>
        </div>
      </div>

      {/* Language Preference */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-100 rounded-xl text-blue-700">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              {t.settings.languagePref}
            </h3>
            <p className="text-xs text-slate-400">Instant multilingual interface (English, मराठी, हिन्दी)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { code: 'en', label: 'English', sub: 'Standard International' },
            { code: 'mr', label: 'मराठी (Marathi)', sub: 'महाराष्ट्र राज्य भाषा' },
            { code: 'hi', label: 'हिन्दी (Hindi)', sub: 'राष्ट्रभाषा संवाद' },
          ].map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() => setLang(item.code as any)}
              className={`p-4 rounded-xl border text-left transition-all ${
                lang === item.code
                  ? 'bg-purple-50/60 border-purple-500 ring-2 ring-purple-500/20 text-purple-950 font-bold'
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="text-sm">{item.label}</div>
              <div className="text-[11px] text-slate-400 font-normal mt-0.5">{item.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Role-Based Access Control (RBAC) Switcher */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-100 rounded-xl text-indigo-700">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              {t.settings.roleSwitcher}
            </h3>
            <p className="text-xs text-slate-400">{t.settings.switchRoleDesc}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(['admin', 'staff', 'viewer'] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => switchRole(r)}
              className={`p-4 rounded-xl border text-left transition-all ${
                user?.role === r
                  ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-500/20 text-purple-900 font-bold'
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="capitalize text-sm font-bold flex items-center justify-between">
                <span>{r}</span>
                {user?.role === r && <CheckCircle className="w-4 h-4 text-purple-600" />}
              </div>
              <p className="text-[11px] text-slate-500 font-normal mt-1">
                {r === 'admin'
                  ? 'Full administrative control across all records'
                  : r === 'staff'
                  ? 'Manage permitted bookings & passenger directory'
                  : 'Read-only view for evaluator demonstration'}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Demonstration Data Management */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <h3 className="font-bold text-slate-900 text-sm sm:text-base">
          College Project Demonstration Controls
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Use these controls during your live professor presentation to demonstrate data isolation, fresh initial seeding, and empty states.
        </p>
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSeed}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Reload Full Demonstration Dataset</span>
          </button>
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-rose-600" />
            <span>Clear to Empty State</span>
          </button>
        </div>
      </div>
    </div>
  );
};
