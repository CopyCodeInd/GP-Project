import React, { useState } from 'react';
import {
  Layers,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  GitMerge,
  ExternalLink,
  Plus,
  Eye,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Building,
  RefreshCw,
  X,
} from 'lucide-react';
import {
  GramPanchayat,
  SanctionedSchemeWork,
  CitizenNeed,
  OverlapItem,
} from '../types';

interface Screen2SchemeCorrelationProps {
  selectedGp: GramPanchayat;
  sanctionedWorks: SanctionedSchemeWork[];
  needs: CitizenNeed[];
  overlaps: OverlapItem[];
  onAddWorkLink: (workId: string, needId: string) => void;
  onRunOverlapCheck: () => void;
  onNavigateToScreen: (screenId: '01' | '02' | '03' | '04' | '05' | '06' | '07') => void;
}

export const Screen2SchemeCorrelation: React.FC<Screen2SchemeCorrelationProps> = ({
  selectedGp,
  sanctionedWorks,
  needs,
  overlaps,
  onAddWorkLink,
  onRunOverlapCheck,
  onNavigateToScreen,
}) => {
  const [selectedFy, setSelectedFy] = useState<string>('FY 2024-25');
  const [activeWorkDetails, setActiveWorkDetails] = useState<SanctionedSchemeWork | null>(null);
  const [activeSanctionDoc, setActiveSanctionDoc] = useState<SanctionedSchemeWork | null>(null);
  const [showComponentCompare, setShowComponentCompare] = useState<boolean>(false);
  const [overlapCheckRunning, setOverlapCheckRunning] = useState<boolean>(false);
  const [overlapResultSummary, setOverlapResultSummary] = useState<string | null>(null);

  // Selected scheme linkages in progress
  const [selectedLinks, setSelectedLinks] = useState<{ needTitle: string; schemeCode: string; needId: string; workId: string }[]>([
    { needTitle: 'Water need (Nai Basti pipeline)', schemeCode: 'JJM', needId: 'NEED-2026-001', workId: 'W-JJM-104' },
    { needTitle: 'Road need (Ambedkar Basti CC road)', schemeCode: 'PMGSY', needId: 'NEED-2026-002', workId: 'W-PMGSY-089' },
  ]);

  // Filter works by GP
  const gpWorks = sanctionedWorks.filter((w) => w.gpId === selectedGp.id);

  // Budget totals calculation
  const totalSanctioned = gpWorks.reduce((sum, w) => sum + w.sanctionedAmount, 0);
  const totalReleased = gpWorks.reduce((sum, w) => sum + w.releasedAmount, 0);
  const totalSpent = gpWorks.reduce((sum, w) => sum + w.spentAmount, 0);
  const totalCommitted = gpWorks.reduce((sum, w) => sum + w.committedAmount, 0);

  const handleRunOverlap = () => {
    setOverlapCheckRunning(true);
    setTimeout(() => {
      onRunOverlapCheck();
      setOverlapCheckRunning(false);
      setOverlapResultSummary(
        'Overlap engine checked 6 records: 1 duplicate risk flagged (Pond desiltation) and 2 convergence opportunities identified.'
      );
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Header breadcrumb bar matching Page 2 */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-bold tracking-wider text-teal-700 uppercase font-mono">
              02 / GRAM PANCHAYAT PLANNING PLATFORM
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Scheme correlation and sanctioned budgets
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Screen 2 · Scheme list, budget details and a side list of selected funding options
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-500 font-medium">Financial Year:</span>
            <select
              value={selectedFy}
              onChange={(e) => setSelectedFy(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-xs font-semibold text-slate-800"
            >
              <option value="FY 2024-25">FY 2024-25</option>
              <option value="FY 2025-26">FY 2025-26</option>
            </select>
          </div>
        </div>

        {/* Budget KPI bar: Sanctioned, Released, Spent, Committed */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100">
          <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
            <div className="text-[10px] uppercase font-bold text-slate-400">Total Sanctioned</div>
            <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
              ₹{(totalSanctioned / 100000).toFixed(2)} L
            </div>
            <div className="text-[10px] text-slate-500">Government Sanctions</div>
          </div>
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-lg p-3">
            <div className="text-[10px] uppercase font-bold text-emerald-700">Released Funds</div>
            <div className="text-base font-bold font-mono text-emerald-900 mt-0.5">
              ₹{(totalReleased / 100000).toFixed(2)} L
            </div>
            <div className="text-[10px] text-emerald-600">In SNA / GP Account</div>
          </div>
          <div className="bg-sky-50/70 border border-sky-200/80 rounded-lg p-3">
            <div className="text-[10px] uppercase font-bold text-sky-700">Spent / Disbursed</div>
            <div className="text-base font-bold font-mono text-sky-900 mt-0.5">
              ₹{(totalSpent / 100000).toFixed(2)} L
            </div>
            <div className="text-[10px] text-sky-600">e-GramSwaraj PFMS Book</div>
          </div>
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-3">
            <div className="text-[10px] uppercase font-bold text-amber-700">Committed Balance</div>
            <div className="text-base font-bold font-mono text-amber-900 mt-0.5">
              ₹{(totalCommitted / 100000).toFixed(2)} L
            </div>
            <div className="text-[10px] text-amber-600">Active Work Orders</div>
          </div>
        </div>
      </div>

      {/* Main 3-Column Layout from Screenshot Page 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Column 1: Schemes and works Card (Left) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            {/* Dark Header */}
            <div className="bg-[#122A3F] text-white px-4 py-3 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold tracking-wide">Schemes and works</span>
                <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                  {gpWorks.length} Active
                </span>
              </div>
              <div className="text-xs text-slate-300 mt-1 flex items-center gap-1">
                <span>{selectedGp.name}</span>
                <span>/</span>
                <span>All Villages</span>
                <span>/</span>
                <span>All Wards</span>
              </div>
            </div>

            {/* Scheme Cards */}
            <div className="p-3 space-y-2.5 max-h-[520px] overflow-y-auto">
              {gpWorks.map((work) => {
                return (
                  <div
                    key={work.id}
                    className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 transition-all text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-slate-900 text-xs">
                          {work.schemeCode} <span className="text-slate-400">/</span> {work.schemeName.split('-')[1] || work.schemeName}
                        </div>
                        <div className="text-[11px] text-slate-600 mt-0.5 line-clamp-1 font-medium">
                          {work.workName}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold shrink-0">
                        {work.id}
                      </span>
                    </div>

                    <div className="mt-2 text-slate-700 font-medium flex items-center justify-between text-[11px]">
                      <span>
                        Sanctioned:{' '}
                        <strong className="text-slate-900 font-mono">
                          ₹{(work.sanctionedAmount / 100000).toFixed(2)} Lakhs
                        </strong>
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setActiveWorkDetails(work)}
                          className="text-teal-700 hover:text-teal-900 font-semibold cursor-pointer underline"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => {
                            if (!selectedLinks.some((l) => l.workId === work.id)) {
                              setSelectedLinks([
                                ...selectedLinks,
                                {
                                  needTitle: work.workName.slice(0, 24) + '...',
                                  schemeCode: work.schemeCode,
                                  needId: work.linkedNeedIds[0] || 'NEED-GEN',
                                  workId: work.id,
                                },
                              ]);
                            }
                          }}
                          className="text-slate-700 hover:text-teal-700 font-bold bg-white px-2 py-0.5 rounded border border-slate-300 cursor-pointer"
                        >
                          + Add
                        </button>
                      </div>
                    </div>

                    {/* Progress indicator */}
                    <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
                      <span>{work.financialYear}</span>
                      <span className="text-emerald-700 font-semibold">
                        Spent: ₹{(work.spentAmount / 100000).toFixed(2)} L
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer matching screenshot */}
            <div className="bg-slate-100/80 px-4 py-2.5 border-t border-slate-200 text-[11px] text-slate-600 space-y-0.5">
              <div>
                <strong>Budget scope:</strong> GP + financial year
              </div>
              <div className="text-slate-500">Source date visible on every record</div>
            </div>
          </div>
        </div>

        {/* Column 2: Selected scheme list (Middle) matching screenshot */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Selected scheme list</h3>
              <span className="text-[11px] text-slate-500">{selectedLinks.length} items matched</span>
            </div>

            {/* Selected items */}
            <div className="space-y-2.5">
              {selectedLinks.map((link, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-slate-900">
                      {link.needTitle} <span className="text-slate-400">/</span>{' '}
                      <span className="text-teal-700 font-bold">{link.schemeCode}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      Linked: {link.workId}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedLinks(selectedLinks.filter((_, i) => i !== idx))}
                    className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Middle Action Buttons from Screenshot */}
            <div className="space-y-2 pt-2">
              <button
                id="btn-compare-work-components"
                onClick={() => setShowComponentCompare(true)}
                className="w-full text-center py-2.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-800 font-medium text-xs rounded-lg border border-slate-200 transition-colors cursor-pointer"
              >
                Compare work components
              </button>

              <button
                id="btn-view-sanction-ref"
                onClick={() => setActiveSanctionDoc(gpWorks[0])}
                className="w-full text-center py-2.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-800 font-medium text-xs rounded-lg border border-slate-200 transition-colors cursor-pointer"
              >
                View sanction reference
              </button>

              <button
                id="btn-run-overlap-check"
                onClick={handleRunOverlap}
                disabled={overlapCheckRunning}
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-lg shadow-xs transition-all cursor-pointer disabled:opacity-70"
              >
                {overlapCheckRunning ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Running Overlap AI Engine...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run overlap check</span>
                  </>
                )}
              </button>
            </div>

            {/* Overlap Result Callout */}
            {overlapResultSummary && (
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg text-xs text-teal-900 space-y-2 animate-fadeIn">
                <div className="flex items-center gap-1.5 font-bold text-teal-800">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>Overlap Check Completed</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-700">{overlapResultSummary}</p>
                <button
                  onClick={() => onNavigateToScreen('06')}
                  className="text-[11px] font-bold text-teal-700 underline flex items-center gap-1"
                >
                  View Details in All-GP Overlap Review (Screen 6) &rarr;
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Rules & Model (Right) matching screenshot */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-4 space-y-5">
            <div>
              <h4 className="text-xs font-bold text-teal-700 tracking-wide uppercase">Budget model</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Show sanctioned, released, spent and committed separately, with financial year and work ID.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-teal-700 tracking-wide uppercase">Correlation</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Match eligible needs to scheme components. Compare existing works before linking funds.
              </p>
            </div>

            <div className="bg-amber-50/60 p-3 rounded-lg border border-amber-200/80">
              <h4 className="text-xs font-bold text-amber-800 tracking-wide uppercase flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Overlap rules</span>
              </h4>
              <div className="text-xs text-slate-700 mt-1.5 space-y-1">
                <div>
                  <strong className="text-rose-700 font-semibold">• Same work and cost component:</strong> flag duplicate risk immediately.
                </div>
                <div>
                  <strong className="text-emerald-700 font-semibold">• Complementary components:</strong> propose convergence package (e.g. PMAY-G + JJM tap).
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <h4 className="text-xs font-bold text-teal-700 tracking-wide uppercase">Saved output</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Work–scheme links, component amounts, source records and an officer’s review decision.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigateToScreen('03')}
                className="w-full flex items-center justify-between p-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer"
              >
                <span>Explore Digital Twin & Solar (Screen 3)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Sanction Document Reference */}
      {activeSanctionDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-5 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <FileSpreadsheet className="w-5 h-5 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-900">Official Sanction Reference Document</h3>
              </div>
              <button
                onClick={() => setActiveSanctionDoc(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Sanction Ref No.</span>
                  <span className="font-mono font-bold text-slate-900">{activeSanctionDoc.sanctionReference}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Source Date</span>
                  <span className="font-semibold text-slate-900">{activeSanctionDoc.sourceDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Implementing Agency</span>
                  <span className="font-semibold text-slate-900">{activeSanctionDoc.contractorOrAgency}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Financial Year</span>
                  <span className="font-semibold text-slate-900">{activeSanctionDoc.financialYear}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mt-2 mb-1">Approved Component Bill of Quantities (BOQ):</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                  {activeSanctionDoc.components.map((comp, idx) => (
                    <li key={idx}>{comp}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveSanctionDoc(null)}
                className="px-4 py-2 bg-teal-700 text-white text-xs font-semibold rounded-lg hover:bg-teal-800"
              >
                Close Reference
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Compare Work Components */}
      {showComponentCompare && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-5 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <GitMerge className="w-5 h-5 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-900">Work Component Comparison & Overlap Check</h3>
              </div>
              <button
                onClick={() => setShowComponentCompare(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600">
                Cross-matching citizen consultation requirements with active government works:
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="border border-sky-200 bg-sky-50/50 p-3 rounded-lg">
                  <div className="text-[10px] uppercase font-bold text-sky-700 mb-1">
                    Citizen Need (Ward 2 Pipeline)
                  </div>
                  <div className="font-semibold text-slate-900">45-Household Tap Distribution Extension</div>
                  <div className="text-slate-500 mt-1">Est: ₹3,80,000 | Scope: HDPE pipes, household meter points</div>
                </div>

                <div className="border border-emerald-200 bg-emerald-50/50 p-3 rounded-lg">
                  <div className="text-[10px] uppercase font-bold text-emerald-700 mb-1">
                    Sanctioned Work (W-JJM-104)
                  </div>
                  <div className="font-semibold text-slate-900">Overhead Tank & Distribution Spine</div>
                  <div className="text-slate-500 mt-1">Sanctioned: ₹24.5 Lakhs | Agency: UP Jal Nigam</div>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-3 text-emerald-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Recommended: Propose Convergence Package</span>
                </div>
                <p className="text-[11px] text-slate-700">
                  Components do not duplicate. The citizen need acts as the last-mile hookup for the main trunk line.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowComponentCompare(false)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Work Details */}
      {activeWorkDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-5 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono text-teal-700 font-bold">{activeWorkDetails.id}</span>
                <h3 className="text-sm font-bold text-slate-900">{activeWorkDetails.workName}</h3>
              </div>
              <button
                onClick={() => setActiveWorkDetails(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg">
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase">Scheme</span>
                  <div className="font-semibold text-slate-900">{activeWorkDetails.schemeName}</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase">Status</span>
                  <div className="font-semibold text-emerald-700">{activeWorkDetails.status}</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase">Sanctioned</span>
                  <div className="font-mono font-bold text-slate-900">
                    ₹{activeWorkDetails.sanctionedAmount.toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase">Spent to Date</span>
                  <div className="font-mono font-bold text-slate-900">
                    ₹{activeWorkDetails.spentAmount.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-800">Approved Work Components:</span>
                <ul className="mt-1 space-y-1 text-slate-600 list-disc list-inside">
                  {activeWorkDetails.components.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveWorkDetails(null)}
                className="px-4 py-2 bg-teal-700 text-white text-xs font-semibold rounded-lg hover:bg-teal-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
