import React, { useState } from 'react';
import {
  CloudRain,
  Droplets,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Plus,
  Compass,
  FileCheck,
  TrendingDown,
  Layers,
  ArrowRight,
  ShieldCheck,
  Filter,
} from 'lucide-react';
import { GramPanchayat, RainwaterCandidate, CitizenNeed } from '../types';

interface Screen5RainwaterHarvestingProps {
  selectedGp: GramPanchayat;
  candidates: RainwaterCandidate[];
  onAddNeed: (need: CitizenNeed) => void;
  onNavigateToScreen: (screenId: '01' | '02' | '03' | '04' | '05' | '06' | '07') => void;
}

export const Screen5RainwaterHarvesting: React.FC<Screen5RainwaterHarvestingProps> = ({
  selectedGp,
  candidates,
  onAddNeed,
  onNavigateToScreen,
}) => {
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('Candidate R-01');
  const [filterType, setFilterType] = useState<'all' | 'candidates' | 'verified' | 'queue'>('candidates');
  const [addedMessage, setAddedMessage] = useState<string | null>(null);

  const selectedCandidate = candidates.find((c) => c.id === selectedCandidateId) || candidates[0];

  const filteredCandidates = candidates.filter((c) => {
    if (filterType === 'verified') return c.status === 'Verified Feasible';
    if (filterType === 'queue') return c.status === 'Field Check Required';
    if (filterType === 'candidates') return c.status === 'Candidate' || c.status === 'Field Check Required';
    return true;
  });

  const handleAddCandidateToAgenda = () => {
    if (!selectedCandidate) return;

    const newNeed: CitizenNeed = {
      id: `NEED-RWH-${Date.now().toString().slice(-4)}`,
      gpId: selectedGp.id,
      village: selectedGp.villages[0] || 'Village',
      ward: selectedCandidate.ward,
      category: 'Rainwater / other',
      title: `Water Harvesting: ${selectedCandidate.suggestedStructure} at ${selectedCandidate.locationName}`,
      description: `Identified via Terrain + Rainfall GIS model (${selectedCandidate.id}). Catchment: ${selectedCandidate.catchmentAreaHa} Ha, Est. Storage: ${selectedCandidate.estStorageCapacityKL.toLocaleString()} kL. Infiltration: ${selectedCandidate.soilInfiltrationRate}.`,
      locationDetails: selectedCandidate.locationName,
      priority: 'High',
      estimatedCost: selectedCandidate.estCostInr,
      status: 'Field Check Required',
      submittedBy: 'Hydrological GIS Engine',
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      lsdgTheme: 'Water sufficiency',
      aiSuggestedScheme: 'WDC-PMKSY / MGNREGS Water Conservation',
    };

    onAddNeed(newNeed);
    setAddedMessage(`${selectedCandidate.id} successfully added to GP Consultation Agenda!`);
    setTimeout(() => setAddedMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header breadcrumb bar matching Page 5 */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-bold tracking-wider text-teal-700 uppercase font-mono">
              05 / GRAM PANCHAYAT PLANNING PLATFORM
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Rainwater harvesting opportunity map
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Screen 5 · Existing site data and terrain analysis produce candidates for field review
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="px-2.5 py-1 rounded bg-teal-50 text-teal-800 font-semibold border border-teal-200">
              Mean Annual Rainfall: <strong>940 mm</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main 3-Column Layout from Screenshot Page 5 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Column 1: Rainwater sites Card (Left) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            {/* Dark Header */}
            <div className="bg-[#122A3F] text-white px-4 py-3 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold tracking-wide">Rainwater sites</span>
                <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                  GIS Model
                </span>
              </div>
              <div className="text-xs text-slate-300 mt-1 flex items-center gap-1">
                <span>{selectedGp.name}</span>
                <span>/</span>
                <span>{selectedCandidate?.ward || 'All Wards'}</span>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* Map of candidate locations */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">Map of candidate locations</span>
                  <span className="text-slate-500 font-mono text-[10px]">Ridge-to-Valley DEM</span>
                </div>

                <div className="relative w-full h-48 bg-[#E6EFEA] rounded-lg border border-slate-300 overflow-hidden shadow-inner">
                  {/* Drainage catchment contours */}
                  <svg className="absolute inset-0 w-full h-full opacity-45 pointer-events-none">
                    <path d="M 10 20 Q 150 140 380 90" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeDasharray="5,2" />
                    <path d="M 80 180 Q 220 120 380 90" fill="none" stroke="#2563EB" strokeWidth="2" strokeDasharray="4,2" />
                    {/* Topographic elevation contours */}
                    <path d="M 0 60 Q 200 40 400 70" fill="none" stroke="#84A98C" strokeWidth="1" />
                    <path d="M 0 110 Q 200 80 400 120" fill="none" stroke="#84A98C" strokeWidth="1" />
                    <path d="M 0 160 Q 200 130 400 170" fill="none" stroke="#84A98C" strokeWidth="1" />
                  </svg>

                  {/* Candidate Site Pins */}
                  {candidates.map((cand) => {
                    const isSelected = cand.id === selectedCandidateId;
                    return (
                      <div
                        key={cand.id}
                        onClick={() => setSelectedCandidateId(cand.id)}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform ${
                          isSelected ? 'scale-125 z-20' : 'hover:scale-110 z-10'
                        }`}
                        style={{ left: `${cand.x}%`, top: `${cand.y}%` }}
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md border-2 ${
                            isSelected
                              ? 'bg-teal-700 text-white border-white ring-2 ring-teal-400'
                              : 'bg-white text-teal-700 border-teal-600'
                          }`}
                        >
                          <Droplets className="w-3.5 h-3.5" />
                        </div>
                        <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-bold bg-slate-900/80 text-white px-1 rounded whitespace-nowrap">
                          {cand.id}
                        </span>
                      </div>
                    );
                  })}

                  {/* Catchment features list overlay matching screenshot */}
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-xs border border-slate-200 rounded p-1.5 text-[10px] text-slate-700 space-y-0.5 shadow-xs">
                    <div>• Existing structures</div>
                    <div>• Potential collection areas</div>
                    <div>• Drainage and catchments</div>
                    <div>• Coverage / missing data</div>
                  </div>
                </div>
              </div>

              {/* Candidate Info Box matching screenshot Page 5 */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-900 text-sm">{selectedCandidate.id}</div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                    {selectedCandidate.status}
                  </span>
                </div>
                <div className="text-slate-600 font-medium">
                  {selectedCandidate.name} ({selectedCandidate.ward})
                </div>

                <div className="space-y-1 text-slate-700 text-[11px] pt-1 border-t border-slate-200/80">
                  <div>
                    <span className="text-slate-500">Evidence:</span>{' '}
                    <strong className="text-slate-900">{selectedCandidate.evidence}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Suggested Structure:</span>{' '}
                    <strong className="text-teal-700 font-bold">{selectedCandidate.suggestedStructure}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Storage Potential:</span>{' '}
                    <strong className="text-slate-900 font-mono">
                      {selectedCandidate.estStorageCapacityKL.toLocaleString()} kL
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Soil Infiltration:</span>{' '}
                    <span>{selectedCandidate.soilInfiltrationRate}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Est. Budget:</span>{' '}
                    <span className="font-mono font-bold text-slate-900">
                      ₹{selectedCandidate.estCostInr.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Add candidate to agenda Button matching screenshot */}
              <button
                id="btn-add-candidate-agenda"
                onClick={handleAddCandidateToAgenda}
                className="w-full bg-[#007A87] hover:bg-[#006672] text-white text-xs font-bold py-2.5 px-4 rounded-lg shadow-sm transition-all cursor-pointer flex items-center justify-center space-x-1.5 active:scale-98"
              >
                <Plus className="w-4 h-4" />
                <span>Add candidate to agenda</span>
              </button>

              {addedMessage && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{addedMessage}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Column 2: Site filter / list Card (Middle) matching screenshot */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-4">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight pb-3 border-b border-slate-100">
              Site filter / list
            </h3>

            <div className="space-y-2 mt-3">
              <button
                onClick={() => setFilterType('verified')}
                className={`w-full text-left p-2.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                  filterType === 'verified'
                    ? 'bg-teal-50 border-teal-500 text-teal-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Existing verified sites
              </button>

              <button
                onClick={() => {
                  setFilterType('candidates');
                  setSelectedCandidateId('Candidate R-01');
                }}
                className={`w-full text-left p-2.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                  selectedCandidateId === 'Candidate R-01'
                    ? 'bg-teal-50 border-teal-500 text-teal-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Candidate R-01
              </button>

              <button
                onClick={() => {
                  setFilterType('candidates');
                  setSelectedCandidateId('Candidate R-02');
                }}
                className={`w-full text-left p-2.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                  selectedCandidateId === 'Candidate R-02'
                    ? 'bg-teal-50 border-teal-500 text-teal-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Candidate R-02
              </button>

              <button
                onClick={() => {
                  setFilterType('candidates');
                  setSelectedCandidateId('Candidate R-03');
                }}
                className={`w-full text-left p-2.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                  selectedCandidateId === 'Candidate R-03'
                    ? 'bg-teal-50 border-teal-500 text-teal-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Candidate R-03 (School Rooftop)
              </button>

              <button
                onClick={() => setFilterType('all')}
                className={`w-full text-left p-2.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                  filterType === 'all'
                    ? 'bg-teal-50 border-teal-500 text-teal-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Data unavailable areas
              </button>

              <button
                onClick={() => setFilterType('queue')}
                className={`w-full text-left p-2.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                  filterType === 'queue'
                    ? 'bg-teal-50 border-teal-500 text-teal-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Field validation queue
              </button>
            </div>
          </div>
        </div>

        {/* Column 3: Source connection, Suitability, Field decision, Saved output (Right) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-4 space-y-5">
            <div>
              <h4 className="text-xs font-bold text-teal-700 tracking-wide uppercase">Source connection</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Fetch authorised APIs or GIS services. Use dated imports where interfaces are unavailable.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-teal-700 tracking-wide uppercase">Suitability analysis</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Combine terrain, drainage, rainfall, soils, land use and existing structures.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-teal-700 tracking-wide uppercase">Field decision</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Check ownership, infiltration, contamination, safety and engineering feasibility.
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <h4 className="text-xs font-bold text-teal-700 tracking-wide uppercase">Saved output</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Candidate geometry, suggested structure, evidence, uncertainty and verification outcome.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigateToScreen('06')}
                className="w-full flex items-center justify-between p-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer"
              >
                <span>Proceed to All-GP Overlap Review (Screen 6)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
