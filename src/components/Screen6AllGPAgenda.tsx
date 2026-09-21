import React, { useState } from 'react';
import {
  FileStack,
  GitCompare,
  AlertTriangle,
  CheckCircle2,
  GitMerge,
  ShieldCheck,
  Building2,
  Sparkles,
  Camera,
  Users,
  Eye,
  ArrowRight,
  Filter,
  Check,
} from 'lucide-react';
import { OverlapItem, GramPanchayat, CitizenNeed } from '../types';

interface Screen6AllGPAgendaProps {
  selectedGp: GramPanchayat;
  allGps: GramPanchayat[];
  overlaps: OverlapItem[];
  needs: CitizenNeed[];
  onUpdateOverlapDecision: (
    overlapId: string,
    decision: 'Keep Separate' | 'Link as Duplicate' | 'Propose Convergence Package',
    reason: string,
    omOwner: string,
    lifecycleCost: number
  ) => void;
  onNavigateToScreen: (screenId: '01' | '02' | '03' | '04' | '05' | '06' | '07') => void;
}

export const Screen6AllGPAgenda: React.FC<Screen6AllGPAgendaProps> = ({
  selectedGp,
  allGps,
  overlaps,
  needs,
  onUpdateOverlapDecision,
  onNavigateToScreen,
}) => {
  const [activeQueueTab, setActiveQueueTab] = useState<
    'all' | 'duplicate' | 'convergence' | 'evidence' | 'decisions' | 'approved'
  >('all');
  const [selectedOverlapId, setSelectedOverlapId] = useState<string>(overlaps[0]?.id || 'OVL-01');

  // Decision form inside inspector
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [selectedDecision, setSelectedDecision] = useState<
    'Keep Separate' | 'Link as Duplicate' | 'Propose Convergence Package'
  >('Propose Convergence Package');
  const [decisionReason, setDecisionReason] = useState(
    'Component convergence approved under 15th FC + JJM synergy plan.'
  );
  const [omOwner, setOmOwner] = useState('Village Water & Sanitation Committee (VWSC)');
  const [lifecycleCost, setLifecycleCost] = useState(380000);
  const [decisionSavedNotice, setDecisionSavedNotice] = useState<string | null>(null);

  const activeOverlap = overlaps.find((o) => o.id === selectedOverlapId) || overlaps[0];

  const filteredOverlaps = overlaps.filter((o) => {
    if (activeQueueTab === 'duplicate') return o.type === 'DUPLICATE_WORK';
    if (activeQueueTab === 'convergence') return o.type === 'CONVERGENCE_OPPORTUNITY';
    if (activeQueueTab === 'evidence') return !!o.shgDroneEvidence;
    if (activeQueueTab === 'decisions') return !!o.officerDecision;
    return true;
  });

  const handleSaveDecision = () => {
    if (!activeOverlap) return;
    onUpdateOverlapDecision(
      activeOverlap.id,
      selectedDecision,
      decisionReason,
      omOwner,
      lifecycleCost
    );
    setDecisionSavedNotice(`Officer review recorded for ${activeOverlap.id}!`);
    setTimeout(() => setDecisionSavedNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header breadcrumb bar matching Page 6 */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-bold tracking-wider text-teal-700 uppercase font-mono">
              06 / GRAM PANCHAYAT PLANNING PLATFORM
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              All-GP agenda and overlap review
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Screen 6 · Combine GP priorities, sanctioned works, SHG observations and drone evidence
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="px-2.5 py-1 rounded bg-slate-100 font-mono text-slate-700 border border-slate-200">
              Block: <strong>Barabanki Sadar</strong> (3 GPs Synchronized)
            </span>
          </div>
        </div>
      </div>

      {/* Main 3-Column Layout from Screenshot Page 6 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Column 1: Consolidated agenda Card (Left) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            {/* Dark Header */}
            <div className="bg-[#122A3F] text-white px-4 py-3 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold tracking-wide">Consolidated agenda</span>
                <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                  Block Review
                </span>
              </div>
              <div className="text-xs text-slate-300 mt-1">
                Barabanki District / All Gram Panchayats
              </div>
            </div>

            {/* Overlap items list */}
            <div className="p-3 space-y-2.5 max-h-[460px] overflow-y-auto">
              {filteredOverlaps.map((item) => {
                const isSelected = item.id === selectedOverlapId;
                const isDup = item.type === 'DUPLICATE_WORK';

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedOverlapId(item.id);
                      if (item.officerDecision) setSelectedDecision(item.officerDecision);
                      if (item.officerReason) setDecisionReason(item.officerReason);
                      if (item.assignedOmOwner) setOmOwner(item.assignedOmOwner);
                      if (item.lifecycleCostInr) setLifecycleCost(item.lifecycleCostInr);
                    }}
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50/50 shadow-xs ring-1 ring-teal-400/30'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <div className="font-bold text-slate-900">
                          {item.gpName} <span className="text-slate-400">/</span> {item.proposedTitle.slice(0, 32)}...
                        </div>
                        <div className="text-[11px] text-slate-600 mt-1 flex items-center gap-1.5">
                          {isDup ? (
                            <span className="text-rose-700 font-bold flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              Duplicate match: {item.matchedWorkId}
                            </span>
                          ) : (
                            <span className="text-emerald-700 font-bold flex items-center gap-1">
                              <GitMerge className="w-3.5 h-3.5" />
                              Possible match: {item.matchedWorkId}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-semibold shrink-0">
                        {item.id}
                      </span>
                    </div>

                    {item.officerDecision && (
                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                        <span className="text-slate-500">Officer Decision:</span>
                        <span className="font-bold text-teal-800 bg-teal-100/70 px-1.5 py-0.2 rounded">
                          {item.officerDecision}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer with Filter matching screenshot Page 6 */}
            <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <span className="font-medium text-slate-500">Filter: state / district / block / GP</span>
              <span className="font-mono font-semibold text-slate-800">{filteredOverlaps.length} cases</span>
            </div>

            {/* Action button matching screenshot */}
            <div className="p-3 border-t border-slate-100">
              <button
                id="btn-open-evidence-review"
                onClick={() => {
                  const element = document.getElementById('officer-decision-card');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full bg-[#007A87] hover:bg-[#006672] text-white text-xs font-bold py-2.5 px-4 rounded-lg shadow-sm transition-all cursor-pointer text-center"
              >
                Open evidence and review
              </button>
            </div>
          </div>
        </div>

        {/* Column 2: Review queue Card (Middle) matching screenshot */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-4">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight pb-3 border-b border-slate-100">
              Review queue
            </h3>

            <div className="space-y-2 mt-3">
              <button
                onClick={() => setActiveQueueTab('duplicate')}
                className={`w-full text-left p-2.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                  activeQueueTab === 'duplicate'
                    ? 'bg-rose-50 border-rose-400 text-rose-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Potential duplicate
              </button>

              <button
                onClick={() => setActiveQueueTab('convergence')}
                className={`w-full text-left p-2.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                  activeQueueTab === 'convergence'
                    ? 'bg-teal-50 border-teal-500 text-teal-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Possible convergence
              </button>

              <button
                onClick={() => setActiveQueueTab('evidence')}
                className={`w-full text-left p-2.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                  activeQueueTab === 'evidence'
                    ? 'bg-teal-50 border-teal-500 text-teal-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                SHG / drone evidence
              </button>

              <button
                onClick={() => setActiveQueueTab('decisions')}
                className={`w-full text-left p-2.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                  activeQueueTab === 'decisions'
                    ? 'bg-teal-50 border-teal-500 text-teal-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Officer decision + reason
              </button>

              <button
                onClick={() => setActiveQueueTab('approved')}
                className={`w-full text-left p-2.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                  activeQueueTab === 'approved'
                    ? 'bg-teal-50 border-teal-500 text-teal-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Approved agenda version
              </button>
            </div>
          </div>
        </div>

        {/* Column 3: Matching engine, Evidence, Officer review, Sustainable plan (Right) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-4 space-y-5">
            <div>
              <h4 className="text-xs font-bold text-teal-700 tracking-wide uppercase">Matching engine</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Check work IDs, location, asset, service, time period and funded components. AI explains candidates.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-teal-700 tracking-wide uppercase">Evidence handling</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                SHGs validate service conditions. Drone imagery checks visible progress, with date and accuracy.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-teal-700 tracking-wide uppercase">Officer review</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Keep separate, link as duplicate or propose convergence. Preserve every source record.
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <h4 className="text-xs font-bold text-teal-700 tracking-wide uppercase">Sustainable plan</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Use 3D scenarios with lifecycle costs, water and energy balance, plus an assigned O&M owner.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigateToScreen('07')}
                className="w-full flex items-center justify-between p-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer"
              >
                <span>View Citizen Scheme Eligibility (Screen 7)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Officer Decision & Evidence Inspector Card */}
      {activeOverlap && (
        <div id="officer-decision-card" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">
                Active Case: {activeOverlap.id} • {activeOverlap.gpName}
              </span>
              <h3 className="text-base font-bold text-slate-900">
                {activeOverlap.proposedTitle}
              </h3>
            </div>
            <span
              className={`px-2.5 py-1 rounded text-xs font-bold ${
                activeOverlap.type === 'DUPLICATE_WORK'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-teal-100 text-teal-800'
              }`}
            >
              {activeOverlap.type === 'DUPLICATE_WORK' ? '⚠️ Duplicate Risk Flagged' : '✨ Convergence Opportunity'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* AI Explanation & Matching Details */}
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
              <div className="flex items-center space-x-1.5 font-bold text-teal-900">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>AI Matching Engine Analysis (Confidence: {Math.round(activeOverlap.confidenceScore * 100)}%)</span>
              </div>
              <p className="text-slate-700 leading-relaxed text-[11px]">{activeOverlap.aiExplanation}</p>

              {activeOverlap.shgDroneEvidence && (
                <div className="mt-2 pt-2 border-t border-slate-200 text-slate-600 text-[11px] space-y-1">
                  <strong className="text-slate-800 block flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5 text-slate-500" />
                    Field Verification & Drone Evidence:
                  </strong>
                  <div>{activeOverlap.shgDroneEvidence}</div>
                </div>
              )}
            </div>

            {/* Officer Statutory Action Form */}
            <div className="bg-teal-50/40 p-3.5 rounded-lg border border-teal-200/80 space-y-3">
              <span className="font-bold text-teal-900 text-xs block">
                Statutory Review Decision & Sustainable O&M Assignment:
              </span>

              <div className="grid grid-cols-3 gap-2">
                {(['Keep Separate', 'Link as Duplicate', 'Propose Convergence Package'] as const).map((dec) => (
                  <button
                    key={dec}
                    type="button"
                    onClick={() => setSelectedDecision(dec)}
                    className={`py-2 px-1 text-[11px] rounded font-semibold text-center transition-all cursor-pointer ${
                      selectedDecision === dec
                        ? 'bg-teal-700 text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {dec}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Officer Review Reason & Justification:
                </label>
                <input
                  type="text"
                  value={decisionReason}
                  onChange={(e) => setDecisionReason(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned O&M Owner:</label>
                  <select
                    value={omOwner}
                    onChange={(e) => setOmOwner(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs text-slate-800"
                  >
                    <option value="Village Water & Sanitation Committee (VWSC)">VWSC (Panchayat)</option>
                    <option value="Self-Help Group (SHG) Federation">SHG Federation (Lakhpati Didi)</option>
                    <option value="Gram Panchayat General Fund">GP General Fund</option>
                    <option value="PWD / Line Department">PWD / Line Department</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lifecycle Cost (₹):</label>
                  <input
                    type="number"
                    value={lifecycleCost}
                    onChange={(e) => setLifecycleCost(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <button
                id="btn-save-officer-decision"
                onClick={handleSaveDecision}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 rounded-lg transition-all cursor-pointer"
              >
                Confirm & Record Statutory Officer Decision
              </button>

              {decisionSavedNotice && (
                <div className="p-2 rounded bg-emerald-100 text-emerald-900 text-[11px] font-semibold flex items-center gap-1.5 animate-fadeIn">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{decisionSavedNotice}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
