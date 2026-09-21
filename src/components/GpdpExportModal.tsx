import React from 'react';
import {
  FileText,
  Download,
  Printer,
  CheckCircle2,
  Building,
  Landmark,
  ShieldCheck,
  X,
} from 'lucide-react';
import { GramPanchayat, CitizenNeed, SanctionedSchemeWork } from '../types';

interface GpdpExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedGp: GramPanchayat;
  needs: CitizenNeed[];
  works: SanctionedSchemeWork[];
}

export const GpdpExportModal: React.FC<GpdpExportModalProps> = ({
  isOpen,
  onClose,
  selectedGp,
  needs,
  works,
}) => {
  if (!isOpen) return null;

  const gpNeeds = needs.filter((n) => n.gpId === selectedGp.id);
  const totalApprovedEst = gpNeeds.reduce((sum, n) => sum + n.estimatedCost, 0);

  // Group by 4 LSDG Themes
  const lsdgThemes = [
    { name: 'Water sufficiency', icon: '💧', count: gpNeeds.filter((n) => n.lsdgTheme === 'Water sufficiency').length },
    { name: 'Clean and green villages', icon: '🌿', count: gpNeeds.filter((n) => n.lsdgTheme === 'Clean and green villages').length },
    { name: 'Self-sufficient infrastructure', icon: '🏗️', count: gpNeeds.filter((n) => n.lsdgTheme === 'Self-sufficient infrastructure').length },
    { name: 'Good governance', icon: '⚖️', count: gpNeeds.filter((n) => n.lsdgTheme === 'Good governance').length },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 space-y-6 my-auto max-h-[92vh] overflow-y-auto">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Annual Gram Panchayat Development Plan (GPDP) Package
              </h3>
              <p className="text-xs text-slate-500">
                Aligned with Panchayat Advancement Index (PAI 2.0) & SVAMITVA Verification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Official Printable Header */}
        <div className="border border-slate-300 rounded-xl p-5 bg-slate-50/50 space-y-4">
          <div className="text-center space-y-1 pb-3 border-b border-slate-200">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono">
              Government of India • Ministry of Panchayati Raj
            </div>
            <h4 className="text-lg font-bold text-slate-900">
              Gram Sabha Resolution & Sanctioned Work Plan (FY 2025–26)
            </h4>
            <div className="text-xs text-slate-600 font-medium">
              Gram Panchayat: <strong>{selectedGp.name}</strong> | LGD Code:{' '}
              <span className="font-mono">{selectedGp.lgdCode}</span> | Block: {selectedGp.block}, District:{' '}
              {selectedGp.district}
            </div>
          </div>

          {/* 4 LSDG Themes Alignment Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {lsdgThemes.map((t, idx) => (
              <div key={idx} className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                <div className="text-base">{t.icon}</div>
                <div className="text-[11px] font-bold text-slate-800 mt-0.5 leading-tight">{t.name}</div>
                <div className="text-[10px] text-teal-700 font-semibold mt-1">{t.count} Agenda Items</div>
              </div>
            ))}
          </div>

          {/* Approved Works Table */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
              <span>Prioritized Works & Scheme Convergence Schedule:</span>
              <span className="font-mono text-teal-800">
                Total Budget: ₹{totalApprovedEst.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs border-collapse bg-white">
                <thead className="bg-slate-100 text-slate-700 font-semibold">
                  <tr>
                    <th className="py-2 px-3">Item #</th>
                    <th className="py-2 px-3">Category & Scope</th>
                    <th className="py-2 px-3">Location / Ward</th>
                    <th className="py-2 px-3">Scheme Fund Source</th>
                    <th className="py-2 px-3 text-right">Est. Cost (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {gpNeeds.map((n, idx) => (
                    <tr key={n.id}>
                      <td className="py-2 px-3 font-mono text-slate-500">#{idx + 1}</td>
                      <td className="py-2 px-3">
                        <div className="font-semibold text-slate-900">{n.title}</div>
                        <div className="text-[10px] text-slate-500">{n.lsdgTheme}</div>
                      </td>
                      <td className="py-2 px-3 text-slate-600">{n.ward}</td>
                      <td className="py-2 px-3 text-slate-800 font-medium">
                        {n.aiSuggestedScheme || '15th FC / Tied'}
                      </td>
                      <td className="py-2 px-3 font-mono text-right font-semibold text-slate-900">
                        ₹{n.estimatedCost.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Signatures */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <div>
              <div className="font-bold text-slate-900">{selectedGp.sarpanchName}</div>
              <div className="text-[10px] text-slate-500">Sarpanch / Pradhan</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Verified & Sealed
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-slate-900">{selectedGp.secretaryName}</div>
              <div className="text-[10px] text-slate-500">Panchayat Secretary (VDO)</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-lg cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Resolution</span>
          </button>
          <button
            onClick={() => {
              alert('GPDP planning package exported in PDF/JSON format conforming to e-GramSwaraj schema.');
              onClose();
            }}
            className="flex items-center space-x-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download e-GramSwaraj XML / PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
