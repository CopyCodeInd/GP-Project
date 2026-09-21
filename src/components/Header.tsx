import React from 'react';
import {
  Landmark,
  Layers,
  FileCheck2,
  Users,
  Building2,
  HelpCircle,
  Wifi,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { GramPanchayat } from '../types';

export type ScreenId = '01' | '02' | '03' | '04' | '05' | '06' | '07';
export type UserRole = 'gp_official' | 'citizen' | 'block_officer';

interface HeaderProps {
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  selectedGp: GramPanchayat;
  allGps: GramPanchayat[];
  onSelectGp: (gp: GramPanchayat) => void;
  userRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  onOpenGpdpExport: () => void;
  onOpenHelp: () => void;
}

const SCREENS: { id: ScreenId; num: string; title: string; short: string; badge?: string }[] = [
  { id: '01', num: '01', title: 'PM–GP Consultation', short: 'Consultation & Agenda' },
  { id: '02', num: '02', title: 'Scheme & Budgets', short: 'Budget Correlation' },
  { id: '03', num: '03', title: 'Digital Twin', short: 'SVAMITVA 2D/3D Map' },
  { id: '04', num: '04', title: 'Citizen Requests', short: 'Geotag & AI Voice' },
  { id: '05', num: '05', title: 'Rainwater Map', short: 'Water Harvesting' },
  { id: '06', num: '06', title: 'All-GP Agenda', short: 'Overlap & Officer Review' },
  { id: '07', num: '07', title: 'My Schemes', short: 'Eligibility & Feedback' },
];

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onSelectScreen,
  selectedGp,
  allGps,
  onSelectGp,
  userRole,
  onChangeRole,
  onOpenGpdpExport,
  onOpenHelp,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#0F2231] text-white border-b border-slate-700 shadow-md">
      {/* Top Banner */}
      <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-600/90 flex items-center justify-center text-white font-bold shadow-inner border border-emerald-400/30">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold tracking-wider text-emerald-400 uppercase font-mono">
                Govt. of India • MoPR / e-GramSwaraj
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                PAI 2.0 & SVAMITVA
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
              Gram Panchayat Planning Platform
            </h1>
          </div>
        </div>

        {/* GP Selector, Role Switcher, Quick Actions */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
          {/* GP Picker */}
          <div className="relative inline-flex items-center bg-slate-800/90 border border-slate-600 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 hover:border-slate-500 transition-colors">
            <Building2 className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
            <select
              id="header-gp-select"
              value={selectedGp.id}
              onChange={(e) => {
                const found = allGps.find((g) => g.id === e.target.value);
                if (found) onSelectGp(found);
              }}
              className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer pr-4"
            >
              {allGps.map((gp) => (
                <option key={gp.id} value={gp.id} className="bg-slate-900 text-white">
                  {gp.name} ({gp.lgdCode}) - {gp.district}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 pointer-events-none" />
          </div>

          {/* Role Switcher */}
          <div className="inline-flex items-center bg-slate-800/90 border border-slate-600 rounded-lg p-1 text-xs">
            <button
              id="role-gp-btn"
              onClick={() => onChangeRole('gp_official')}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                userRole === 'gp_official'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Gram Panchayat Sarpanch & Secretary view"
            >
              🏛️ GP Sarpanch
            </button>
            <button
              id="role-citizen-btn"
              onClick={() => {
                onChangeRole('citizen');
                if (currentScreen !== '04' && currentScreen !== '07') {
                  onSelectScreen('04');
                }
              }}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                userRole === 'citizen'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Citizen & SHG reporting view"
            >
              👨‍👩‍👧 Citizen / SHG
            </button>
            <button
              id="role-officer-btn"
              onClick={() => {
                onChangeRole('block_officer');
                if (currentScreen !== '02' && currentScreen !== '06') {
                  onSelectScreen('06');
                }
              }}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                userRole === 'block_officer'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Block Development & Planning Officer view"
            >
              📋 Block Officer
            </button>
          </div>

          {/* Export GPDP Plan */}
          <button
            id="export-gpdp-plan-btn"
            onClick={onOpenGpdpExport}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm border border-emerald-400/40 transition-all cursor-pointer active:scale-95"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export GPDP</span>
            <span className="text-[10px] bg-emerald-800/60 px-1 py-0.5 rounded text-emerald-200">
              PAI 2.0
            </span>
          </button>

          {/* Help & Guide */}
          <button
            id="open-guide-btn"
            onClick={onOpenHelp}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="How to use the 7 screens"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Live Sync Badge */}
          <div className="hidden lg:flex items-center space-x-1.5 text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-1 rounded-md">
            <Wifi className="w-3 h-3 animate-pulse" />
            <span>Live Sync</span>
          </div>
        </div>
      </div>

      {/* Screen Navigation Tabs (Screen 1 to 7) */}
      <nav className="bg-[#0B1722] px-2 sm:px-4 flex items-center overflow-x-auto scrollbar-none py-1.5 gap-1.5 sm:gap-2">
        {SCREENS.map((s) => {
          const isActive = currentScreen === s.id;
          return (
            <button
              key={s.id}
              id={`nav-screen-${s.id}`}
              onClick={() => onSelectScreen(s.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-teal-600 text-white font-semibold shadow-sm ring-1 ring-teal-400/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                  isActive ? 'bg-teal-800 text-teal-100' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {s.num}
              </span>
              <span>{s.title}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};
