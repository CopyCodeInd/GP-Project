import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Radio,
  PhoneCall,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  AlertCircle,
  Volume2,
  UserCheck,
  Send,
  Droplets,
  Route,
  Trash2,
  Sun,
  CloudRain,
  Home,
  Briefcase,
  ChevronRight,
} from 'lucide-react';
import { GramPanchayat, CitizenNeed, ServiceCategory, PriorityLevel, LSDGTheme } from '../types';

interface Screen1ConsultationProps {
  selectedGp: GramPanchayat;
  needs: CitizenNeed[];
  onAddNeed: (need: CitizenNeed) => void;
  onNavigateToScreen: (screenId: '01' | '02' | '03' | '04' | '05' | '06' | '07') => void;
}

const CATEGORIES: { id: ServiceCategory; icon: React.ReactNode; defaultLsdg: LSDGTheme; desc: string }[] = [
  { id: 'Road / access', icon: <Route className="w-4 h-4 text-amber-600" />, defaultLsdg: 'Self-sufficient infrastructure', desc: 'CC roads, bridges, culverts, footpath paving' },
  { id: 'Drinking water', icon: <Droplets className="w-4 h-4 text-sky-600" />, defaultLsdg: 'Water sufficiency', desc: 'Household tap connections, pipelines, OHT tank' },
  { id: 'Drainage / sanitation', icon: <Trash2 className="w-4 h-4 text-emerald-600" />, defaultLsdg: 'Clean and green villages', desc: 'Covered drains, soak pits, solid/liquid waste' },
  { id: 'Solar / public lighting', icon: <Sun className="w-4 h-4 text-orange-500" />, defaultLsdg: 'Clean and green villages', desc: 'Rooftop solar, streetlights, agricultural pumps' },
  { id: 'Rainwater / other', icon: <CloudRain className="w-4 h-4 text-teal-600" />, defaultLsdg: 'Water sufficiency', desc: 'Pond desiltation, recharge pits, check dams' },
  { id: 'Rural housing', icon: <Home className="w-4 h-4 text-indigo-600" />, defaultLsdg: 'Self-sufficient infrastructure', desc: 'PMAY-G pucca houses, basic amenities' },
  { id: 'Livelihood / SHG', icon: <Briefcase className="w-4 h-4 text-purple-600" />, defaultLsdg: 'Good governance', desc: 'Lakhpati Didi enterprises, toolkits, credit' },
];

export const Screen1Consultation: React.FC<Screen1ConsultationProps> = ({
  selectedGp,
  needs,
  onAddNeed,
  onNavigateToScreen,
}) => {
  // Consultation call state
  const [selectedVillage, setSelectedVillage] = useState(selectedGp.villages[0] || 'Main Village');
  const [selectedWard, setSelectedWard] = useState(selectedGp.wards[1] || 'Ward 2');
  const [isAudioLive, setIsAudioLive] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [audioFallback, setAudioFallback] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState(`${selectedGp.sarpanchName} (Sarpanch)`);
  const [speakingQueue, setSpeakingQueue] = useState([
    { name: 'Sunita Devi (SHG Lead, Ward 2)', status: 'Waiting' },
    { name: 'Ram Prasad Yadav (Ward Member 1)', status: 'Waiting' },
    { name: 'Kailash Nath (Trader, Ward 4)', status: 'Waiting' },
  ]);

  // Selected requirement form state
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('Drinking water');
  const [customTitle, setCustomTitle] = useState('Drinking water pipeline extension');
  const [customDesc, setCustomDesc] = useState('Ward 2 households facing water pressure drop during peak morning hours.');
  const [priority, setPriority] = useState<PriorityLevel>('High');
  const [estimatedCost, setEstimatedCost] = useState<number>(350000);
  const [showDrawer, setShowDrawer] = useState(true);
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);

  const callId = `CALL-2026-0921-${selectedGp.name.replace(/\s+/g, '').slice(0, 3).toUpperCase()}`;

  const handleSubmitRequirement = () => {
    const categoryInfo = CATEGORIES.find((c) => c.id === selectedCategory);
    const newNeedId = `NEED-${Date.now().toString().slice(-4)}`;
    const newNeed: CitizenNeed = {
      id: newNeedId,
      callId,
      gpId: selectedGp.id,
      village: selectedVillage,
      ward: selectedWard,
      category: selectedCategory,
      title: customTitle || `${selectedCategory} in ${selectedWard}`,
      description: customDesc || `Identified during PM-GP Consultation call ${callId}`,
      locationDetails: `${selectedVillage}, ${selectedWard}`,
      priority,
      estimatedCost: Number(estimatedCost) || 200000,
      status: 'Pending Review',
      submittedBy: currentSpeaker,
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      lsdgTheme: categoryInfo ? categoryInfo.defaultLsdg : 'Water sufficiency',
      aiSuggestedScheme:
        selectedCategory === 'Drinking water'
          ? 'Jal Jeevan Mission (JJM)'
          : selectedCategory === 'Road / access'
          ? 'PMGSY'
          : selectedCategory === 'Drainage / sanitation'
          ? 'Swachh Bharat Mission-G'
          : selectedCategory === 'Solar / public lighting'
          ? 'PM Surya Ghar'
          : 'MGNREGS',
    };

    onAddNeed(newNeed);
    setSubmissionSuccess(`Requirement submitted as ${newNeedId} and saved to GP Agenda.`);
    setTimeout(() => setSubmissionSuccess(null), 4000);
  };

  const grantSpeakingRole = (name: string, index: number) => {
    setCurrentSpeaker(name);
    setSpeakingQueue((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Header breadcrumb bar matching Page 1 */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-bold tracking-wider text-emerald-700 uppercase font-mono">
              01 / GRAM PANCHAYAT PLANNING PLATFORM
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              PM–GP consultation and requirement capture
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Screen 1 · Moderated call with a requirement list that becomes the GP agenda
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="px-2.5 py-1 rounded bg-slate-100 font-mono text-slate-600 border border-slate-200">
              Call ID: <strong className="text-slate-800">{callId}</strong>
            </span>
            <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Live Session Active
            </span>
          </div>
        </div>
      </div>

      {/* Main 3-Column Layout from Screenshot Page 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Column 1: PM consultation Card (Left) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            {/* Dark Header */}
            <div className="bg-[#122A3F] text-white px-4 py-3 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold tracking-wide">PM consultation</span>
                </div>
                <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                  {selectedGp.lgdCode}
                </span>
              </div>
              <div className="text-xs text-slate-300 mt-1 flex items-center gap-1">
                <span>{selectedGp.name}</span>
                <span>/</span>
                <span>{selectedVillage}</span>
                <span>/</span>
                <span>{selectedWard}</span>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* Village & Ward selectors */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Village</label>
                  <select
                    value={selectedVillage}
                    onChange={(e) => setSelectedVillage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-md p-1.5 font-medium text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  >
                    {selectedGp.villages.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Ward</label>
                  <select
                    value={selectedWard}
                    onChange={(e) => setSelectedWard(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-md p-1.5 font-medium text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  >
                    {selectedGp.wards.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Live session / audio fallback box */}
              <div className="bg-sky-50/70 border border-sky-200 rounded-lg p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                    <span className="text-xs font-bold text-slate-900">
                      Live session / audio fallback
                    </span>
                  </div>
                  <button
                    onClick={() => setAudioFallback(!audioFallback)}
                    className={`text-[10px] px-2 py-0.5 rounded font-medium transition-colors ${
                      audioFallback ? 'bg-amber-100 text-amber-800' : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    {audioFallback ? 'Audio Fallback (2G)' : 'HD VoIP'}
                  </button>
                </div>

                {/* Speaker indicator */}
                <div className="bg-white rounded-md p-2 border border-sky-100 flex items-center justify-between text-xs">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Selected speaker</div>
                    <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      {currentSpeaker}
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-1.5 rounded-full ${
                      isMuted ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-700'
                    }`}
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Waveform graphic */}
                <div className="h-6 flex items-center justify-center space-x-1 px-4 bg-slate-900/5 rounded">
                  <span className="w-1 h-3 bg-emerald-500 rounded-full animate-bounce"></span>
                  <span className="w-1 h-5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.1s]"></span>
                  <span className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1 h-6 bg-teal-600 rounded-full animate-bounce [animation-delay:0.15s]"></span>
                  <span className="w-1 h-4 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.3s]"></span>
                  <span className="w-1 h-2 bg-slate-400 rounded-full"></span>
                </div>

                <div className="text-[11px] text-slate-600">
                  <strong>Citizens:</strong> submit needs / request turn
                </div>

                {/* Queue */}
                {speakingQueue.length > 0 && (
                  <div className="space-y-1 pt-1 border-t border-sky-200/60">
                    <div className="text-[10px] text-slate-500 font-medium">Turn Queue (3 waiting):</div>
                    {speakingQueue.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[11px] bg-white/80 px-2 py-1 rounded">
                        <span className="truncate text-slate-700 max-w-[170px]">{item.name}</span>
                        <button
                          onClick={() => grantSpeakingRole(item.name, idx)}
                          className="text-[10px] text-emerald-700 hover:text-emerald-900 font-bold bg-emerald-50 px-1.5 py-0.5 rounded cursor-pointer"
                        >
                          Grant Turn
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Requirement Summary Box matching screenshot */}
              <div className="space-y-3 pt-2">
                <button
                  id="btn-add-req-header"
                  onClick={() => setShowDrawer(true)}
                  className="w-full flex items-center justify-center space-x-1.5 bg-[#007A87] hover:bg-[#006672] text-white text-xs font-semibold py-2.5 px-4 rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add requirement</span>
                </button>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1.5 text-xs">
                  <div className="text-slate-700">
                    <span className="text-slate-500">Selected:</span>{' '}
                    <strong className="text-slate-900">{selectedCategory}</strong>
                  </div>
                  <div className="text-slate-700">
                    <span className="text-slate-500">Location:</span>{' '}
                    <strong className="text-slate-900">{selectedWard}</strong>
                  </div>
                  <div className="text-slate-700 flex items-center gap-2">
                    <span className="text-slate-500">Priority:</span>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                      className="bg-white border border-slate-300 rounded px-2 py-0.5 text-xs font-semibold text-slate-800"
                    >
                      <option value="High">high</option>
                      <option value="Medium">medium</option>
                      <option value="Low">low</option>
                    </select>
                  </div>
                </div>

                {/* Submit for GP review Button */}
                <button
                  id="btn-submit-gp-review"
                  onClick={handleSubmitRequirement}
                  className="w-full bg-[#007A87] hover:bg-[#006672] text-white text-xs font-bold py-2.5 px-4 rounded-lg shadow-sm transition-all cursor-pointer active:scale-98"
                >
                  Submit for GP review
                </button>

                {submissionSuccess && (
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 text-xs text-emerald-800 flex items-center gap-2 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{submissionSuccess}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Requirement drawer (Middle) matching screenshot */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Requirement drawer</h3>
              <span className="text-[11px] text-slate-500">Click to select & configure</span>
            </div>

            <div className="space-y-2.5 mt-3">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <div
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setCustomTitle(`${cat.id} in ${selectedWard}`);
                    }}
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50/50 shadow-xs ring-1 ring-teal-400/30'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {cat.icon}
                        <span className="font-semibold text-slate-900">{cat.id}</span>
                      </div>
                      {isSelected && (
                        <span className="text-[10px] font-bold bg-teal-600 text-white px-1.5 py-0.2 rounded">
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 pl-6">{cat.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Quick edit drawer box */}
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 text-xs">
              <label className="block font-semibold text-slate-800">
                Requirement Details for GP Agenda:
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="e.g. 200m CC road with drainage"
                className="w-full bg-slate-50 border border-slate-300 rounded-md p-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              <textarea
                rows={2}
                value={customDesc}
                onChange={(e) => setCustomDesc(e.target.value)}
                placeholder="Citizen justification / issue details..."
                className="w-full bg-slate-50 border border-slate-300 rounded-md p-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none"
              />
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Est. Budget:</span>
                <div className="flex items-center space-x-1">
                  <span className="text-slate-600 font-bold">₹</span>
                  <input
                    type="number"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(Number(e.target.value))}
                    className="w-24 bg-slate-50 border border-slate-300 rounded px-2 py-1 text-right font-mono font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Interaction, Call control, Saved output (Right) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-4 space-y-5">
            <div>
              <h4 className="text-xs font-bold text-teal-700 tracking-wide uppercase">Interaction</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Tap <strong>Add</strong> to open the side list. Select a service, enter the location and confirm.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-teal-700 tracking-wide uppercase">Call control</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Every household can submit a need. The moderator grants one live speaking role at a time.
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <h4 className="text-xs font-bold text-teal-700 tracking-wide uppercase">Saved output</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Call ID, GP code, citizen need ID, location, priority and GP validation status.
              </p>
              <div className="mt-2.5 pt-2 border-t border-slate-200/80 font-mono text-[11px] text-slate-700 space-y-0.5">
                <div>• Call ID: {callId}</div>
                <div>• GP LGD: {selectedGp.lgdCode}</div>
                <div>• Total Needs in Agenda: {needs.filter((n) => n.gpId === selectedGp.id).length}</div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-teal-700 tracking-wide uppercase">Mobile behaviour</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                The right drawer becomes a full-width sheet. Keep offline drafts and reconnect safely.
              </p>
            </div>

            {/* Link to Screen 2 */}
            <div className="pt-2">
              <button
                onClick={() => onNavigateToScreen('02')}
                className="w-full flex items-center justify-between p-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer"
              >
                <span>Proceed to Scheme Correlation (Screen 2)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* GP Agenda Table generated from consultation */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Active GP Consultation Agenda & Requirements ({selectedGp.name})
            </h3>
            <p className="text-xs text-slate-500">
              Directly populated from citizen consultations; ready for scheme budget correlation
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            {needs.filter((n) => n.gpId === selectedGp.id).length} items recorded
          </span>
        </div>

        <div className="overflow-x-auto mt-3">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="py-2.5 px-3">Need ID</th>
                <th className="py-2.5 px-3">Service Category</th>
                <th className="py-2.5 px-3">Requirement Title</th>
                <th className="py-2.5 px-3">Ward / Location</th>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3">Est. Budget</th>
                <th className="py-2.5 px-3">GP Status</th>
                <th className="py-2.5 px-3">Mapped Scheme</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {needs
                .filter((n) => n.gpId === selectedGp.id)
                .map((need) => (
                  <tr key={need.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-medium text-slate-800">{need.id}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-700">{need.category}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-900">{need.title}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-xs">{need.description}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{need.ward}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          need.priority === 'High'
                            ? 'bg-rose-100 text-rose-700'
                            : need.priority === 'Medium'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {need.priority}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-800">
                      ₹{need.estimatedCost.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-teal-50 text-teal-800 border border-teal-200">
                        {need.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-700 font-medium">
                      {need.aiSuggestedScheme || 'GPDP Unallocated'}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
