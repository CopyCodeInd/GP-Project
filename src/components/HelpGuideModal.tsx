import React from 'react';
import {
  HelpCircle,
  PhoneCall,
  FileSpreadsheet,
  Layers,
  MapPin,
  CloudRain,
  FileStack,
  CheckCircle2,
  X,
} from 'lucide-react';

interface HelpGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScreen: (screenId: '01' | '02' | '03' | '04' | '05' | '06' | '07') => void;
}

export const HelpGuideModal: React.FC<HelpGuideModalProps> = ({
  isOpen,
  onClose,
  onSelectScreen,
}) => {
  if (!isOpen) return null;

  const screens = [
    {
      id: '01',
      num: 'Screen 1',
      title: 'PM–GP Consultation & Requirement Capture',
      desc: 'Moderated virtual Gram Sabha call with audio fallback. Citizen turns, speaker queue, requirement drawer, and live agenda creation.',
      icon: <PhoneCall className="w-4 h-4 text-emerald-600" />,
    },
    {
      id: '02',
      num: 'Screen 2',
      title: 'Scheme Correlation & Sanctioned Budgets',
      desc: 'Track JJM, PMGSY, SBM-G, MGNREGS budgets (Sanctioned, Released, Spent, Committed). Compare work components and run overlap checks.',
      icon: <FileSpreadsheet className="w-4 h-4 text-sky-600" />,
    },
    {
      id: '03',
      num: 'Screen 3',
      title: 'Village Digital Twin & Solar Potential',
      desc: 'Interactive 2D/3D map with SVAMITVA survey parcels, building heights, rooftop solar feasibility (kWp & savings), and "Create need from gap".',
      icon: <Layers className="w-4 h-4 text-amber-600" />,
    },
    {
      id: '04',
      num: 'Screen 4',
      title: 'Citizen Requests with AI & Geotags',
      desc: 'Mobile-friendly voice & text reporting. Natural language AI auto-classifies category & scheme. High-accuracy DGPS pin drop with photo upload.',
      icon: <MapPin className="w-4 h-4 text-rose-600" />,
    },
    {
      id: '05',
      num: 'Screen 5',
      title: 'Rainwater Harvesting Opportunity Map',
      desc: 'GIS terrain & rainfall model identifying percolation tanks, check dams, and rooftop recharge pits. 1-click addition to GP agenda.',
      icon: <CloudRain className="w-4 h-4 text-teal-600" />,
    },
    {
      id: '06',
      num: 'Screen 6',
      title: 'All-GP Agenda & Overlap Review',
      desc: 'Block/District officer portal. AI explains duplicate funding risks vs convergence opportunities. Record statutory decisions & assign O&M owners.',
      icon: <FileStack className="w-4 h-4 text-indigo-600" />,
    },
    {
      id: '07',
      num: 'Screen 7',
      title: 'Citizen Scheme Eligibility & Feedback',
      desc: 'Personalized "My Eligible Schemes" based on citizen profile. Required documents checklist and live grievance tracking with officer replies.',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 my-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-teal-600" />
            <h3 className="text-base font-bold text-slate-900">
              Gram Panchayat Planning Platform Guide
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {screens.map((s) => (
            <div
              key={s.id}
              onClick={() => {
                onSelectScreen(s.id as any);
                onClose();
              }}
              className="p-3 bg-slate-50 hover:bg-teal-50/50 border border-slate-200 hover:border-teal-300 rounded-xl cursor-pointer transition-all text-xs"
            >
              <div className="flex items-center justify-between font-bold text-slate-900">
                <div className="flex items-center space-x-2">
                  {s.icon}
                  <span>
                    {s.num} · {s.title}
                  </span>
                </div>
                <span className="text-[11px] text-teal-700 font-semibold underline">Jump &rarr;</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1 pl-6">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg"
          >
            Got it, explore platform
          </button>
        </div>
      </div>
    </div>
  );
};
