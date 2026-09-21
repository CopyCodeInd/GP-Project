import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  MapPin,
  Camera,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  Send,
  Volume2,
  FileText,
  Navigation,
  Clock,
  RotateCcw,
  ArrowRight,
  Upload,
} from 'lucide-react';
import { GramPanchayat, CitizenNeed, ServiceCategory } from '../types';

interface Screen4CitizenRequestProps {
  selectedGp: GramPanchayat;
  existingNeeds: CitizenNeed[];
  onAddNeed: (need: CitizenNeed) => void;
  onNavigateToScreen: (screenId: '01' | '02' | '03' | '04' | '05' | '06' | '07') => void;
}

const SERVICE_CATEGORIES = [
  'Road / footpath',
  'Water supply',
  'Drainage / waste',
  'Streetlight / electricity',
  'Other local service',
];

const QUICK_VOICE_SAMPLES = [
  'We need water in Ward 2.',
  'Road washed out near primary school culvert after heavy rain.',
  'Covered drain overflowing near Anganwadi centre in Ward 3.',
  'Streetlight broken at Weekly Haat bazaar chowk.',
  'Traditional pond silting up in Ward 5, needs desilting before monsoon.',
];

export const Screen4CitizenRequest: React.FC<Screen4CitizenRequestProps> = ({
  selectedGp,
  existingNeeds,
  onAddNeed,
  onNavigateToScreen,
}) => {
  const [inputText, setInputText] = useState('We need water in Ward 2.');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Water supply');
  const [selectedVillage, setSelectedVillage] = useState(selectedGp.villages[0] || 'Main Village');
  const [selectedWard, setSelectedWard] = useState(selectedGp.wards[1] || 'Ward 2');
  const [pinCoords, setPinCoords] = useState<{ x: number; y: number; lat: number; lng: number }>({
    x: 42,
    y: 36,
    lat: 26.8482,
    lng: 80.9478,
  });
  const [gpsAccuracy, setGpsAccuracy] = useState<number>(3.4);
  const [hasPhotoAttached, setHasPhotoAttached] = useState(true);
  const [hasVoiceNoteAttached, setHasVoiceNoteAttached] = useState(true);
  const [isClassifyingAi, setIsClassifyingAi] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{
    category: string;
    scheme: string;
    priority: string;
    lsdg: string;
    explanation: string;
  }>({
    category: 'Drinking water',
    scheme: 'Jal Jeevan Mission (JJM)',
    priority: 'High',
    lsdg: 'Water sufficiency',
    explanation: 'Classified based on "water in Ward 2" need. Mapped to JJM household tap scheme under LSDG Water sufficiency theme.',
  });

  const [submittedRequest, setSubmittedRequest] = useState<CitizenNeed | null>(null);
  const [nearbyDuplicateWarning, setNearbyDuplicateWarning] = useState<CitizenNeed | null>(null);

  // Trigger AI classification (client + server endpoint)
  const handleAnalyzeText = async (text: string) => {
    setInputText(text);
    setIsClassifyingAi(true);

    try {
      const res = await fetch('/api/ai/classify-need', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, location: `${selectedVillage}, ${selectedWard}` }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiSuggestion({
          category: data.category || 'Drinking water',
          scheme: data.suggestedScheme || 'Jal Jeevan Mission (JJM)',
          priority: data.priority || 'High',
          lsdg: data.lsdgTheme || 'Water sufficiency',
          explanation: data.aiExplanation || 'Analyzed via rural planning model.',
        });
        if (data.category.toLowerCase().includes('water')) setSelectedCategory('Water supply');
        else if (data.category.toLowerCase().includes('road')) setSelectedCategory('Road / footpath');
        else if (data.category.toLowerCase().includes('drain')) setSelectedCategory('Drainage / waste');
        else if (data.category.toLowerCase().includes('solar')) setSelectedCategory('Streetlight / electricity');
        else setSelectedCategory('Other local service');
      }
    } catch (err) {
      console.warn('Classification network fallback');
    } finally {
      setIsClassifyingAi(false);
    }

    // Check for nearby duplicates
    const dup = existingNeeds.find(
      (n) =>
        n.gpId === selectedGp.id &&
        (text.toLowerCase().includes('water') && n.category === 'Drinking water' ||
          text.toLowerCase().includes('road') && n.category === 'Road / access' ||
          text.toLowerCase().includes('drain') && n.category === 'Drainage / sanitation')
    );
    setNearbyDuplicateWarning(dup || null);
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    const lat = Number((26.845 + (y / 1000)).toFixed(4));
    const lng = Number((80.945 + (x / 1000)).toFixed(4));
    setPinCoords({ x, y, lat, lng });
    setGpsAccuracy(Number((2.5 + Math.random() * 2).toFixed(1)));
  };

  const handleSubmit = () => {
    let serviceCat: ServiceCategory = 'Drinking water';
    if (selectedCategory === 'Road / footpath') serviceCat = 'Road / access';
    else if (selectedCategory === 'Drainage / waste') serviceCat = 'Drainage / sanitation';
    else if (selectedCategory === 'Streetlight / electricity') serviceCat = 'Solar / public lighting';
    else if (selectedCategory === 'Other local service') serviceCat = 'Rainwater / other';

    const reqId = `REQ-${selectedGp.name.slice(3, 6).toUpperCase()}-2026-${Date.now().toString().slice(-3)}`;
    const newNeed: CitizenNeed = {
      id: reqId,
      gpId: selectedGp.id,
      village: selectedVillage,
      ward: selectedWard,
      category: serviceCat,
      title: inputText.length > 60 ? inputText.slice(0, 60) + '...' : inputText,
      description: inputText,
      locationDetails: `${selectedWard} (GPS: ${pinCoords.lat}°N, ${pinCoords.lng}°E)`,
      coordinates: { lat: pinCoords.lat, lng: pinCoords.lng },
      gpsAccuracyMeters: gpsAccuracy,
      priority: (aiSuggestion.priority as any) || 'High',
      estimatedCost: 150000,
      status: 'Pending Review',
      submittedBy: 'Resident / Citizen Mobile Report',
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      lsdgTheme: (aiSuggestion.lsdg as any) || 'Water sufficiency',
      aiSuggestedScheme: aiSuggestion.scheme,
      aiConfidence: 0.92,
      hasPhoto: hasPhotoAttached,
      hasVoiceNote: hasVoiceNoteAttached,
    };

    onAddNeed(newNeed);
    setSubmittedRequest(newNeed);
  };

  return (
    <div className="space-y-6">
      {/* Header breadcrumb bar matching Page 4 */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-bold tracking-wider text-teal-700 uppercase font-mono">
              04 / GRAM PANCHAYAT PLANNING PLATFORM
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Citizen requests with AI assistance and geotags
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Screen 4 · People report a road, water or other service need directly on the map
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="px-2.5 py-1 rounded bg-sky-50 text-sky-800 font-semibold border border-sky-200 flex items-center gap-1">
              <Navigation className="w-3.5 h-3.5 text-sky-600" />
              <span>DGPS Active: ± {gpsAccuracy}m</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main 3-Column Layout from Screenshot Page 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Column 1: Report a service need Card (Left) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            {/* Dark Header matching screenshot */}
            <div className="bg-[#122A3F] text-white px-4 py-3 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold tracking-wide">Report a service need</span>
                <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                  Citizen Portal
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
              {/* Village / Ward selection */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Village</label>
                  <select
                    value={selectedVillage}
                    onChange={(e) => setSelectedVillage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-md p-1.5 font-medium text-slate-800"
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
                    className="w-full bg-slate-50 border border-slate-300 rounded-md p-1.5 font-medium text-slate-800"
                  >
                    {selectedGp.wards.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Speak / type your need */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>Speak / type your need</span>
                  </label>
                  <button
                    onClick={() => {
                      setIsRecording(!isRecording);
                      if (!isRecording) {
                        setTimeout(() => {
                          setIsRecording(false);
                          handleAnalyzeText('We need water in Ward 2.');
                        }, 2500);
                      }
                    }}
                    className={`flex items-center space-x-1 text-[11px] px-2 py-0.5 rounded-full font-semibold transition-all cursor-pointer ${
                      isRecording
                        ? 'bg-rose-100 text-rose-700 animate-pulse'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300'
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>{isRecording ? 'Listening (Hindi/Eng)...' : 'Simulate Mic'}</span>
                  </button>
                </div>

                <div className="relative">
                  <textarea
                    rows={3}
                    value={inputText}
                    onChange={(e) => handleAnalyzeText(e.target.value)}
                    placeholder="“We need water in Ward 2.”"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs text-slate-900 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                {/* Quick voice phrases chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 font-medium self-center">Quick tests:</span>
                  {QUICK_VOICE_SAMPLES.map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnalyzeText(sample)}
                      className="text-[10px] bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 px-2 py-0.5 rounded border border-slate-200 cursor-pointer"
                    >
                      {sample.split(' ')[0]} {sample.split(' ')[1]} {sample.split(' ')[2]}...
                    </button>
                  ))}
                </div>
              </div>

              {/* Geotag map preview with drop pin */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">Drop pin / draw road route</span>
                  <span className="text-[11px] font-mono text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    GPS accuracy: ± {gpsAccuracy}m
                  </span>
                </div>

                <div
                  onClick={handleMapClick}
                  className="relative w-full h-36 bg-[#E3EDE0] rounded-lg border border-slate-300 overflow-hidden cursor-crosshair group shadow-inner"
                  title="Click anywhere on the village map to drop geotag pin"
                >
                  {/* Subtle cadastral lines */}
                  <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none">
                    <line x1="0" y1="50" x2="400" y2="50" stroke="#5B8246" strokeWidth="1" strokeDasharray="4,4" />
                    <line x1="0" y1="100" x2="400" y2="100" stroke="#5B8246" strokeWidth="1" strokeDasharray="4,4" />
                    <path d="M 0 30 Q 150 90 350 70" fill="none" stroke="#D18F51" strokeWidth="4" />
                  </svg>

                  {/* Dropped Pin */}
                  <div
                    className="absolute -translate-x-1/2 -translate-y-full transition-all duration-300 pointer-events-none"
                    style={{ left: `${pinCoords.x}%`, top: `${pinCoords.y}%` }}
                  >
                    <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-0.5 rounded text-[10px] text-slate-700 font-mono shadow-xs">
                    Lat: {pinCoords.lat}° N, Long: {pinCoords.lng}° E
                  </div>
                  <div className="absolute top-2 right-2 bg-slate-900/70 text-white px-2 py-0.5 rounded text-[9px]">
                    Click to relocate pin
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 font-medium">
                  Confirm location on map (near {selectedWard})
                </div>
              </div>

              {/* Add photo or voice note */}
              <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-700">Add photo or voice note</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setHasPhotoAttached(!hasPhotoAttached)}
                    className={`flex items-center space-x-1 px-2.5 py-1 rounded font-medium transition-colors ${
                      hasPhotoAttached
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-white text-slate-600 border border-slate-300'
                    }`}
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{hasPhotoAttached ? 'Photo (1)' : 'Attach Photo'}</span>
                  </button>
                  <button
                    onClick={() => setHasVoiceNoteAttached(!hasVoiceNoteAttached)}
                    className={`flex items-center space-x-1 px-2.5 py-1 rounded font-medium transition-colors ${
                      hasVoiceNoteAttached
                        ? 'bg-sky-100 text-sky-800 border border-sky-300'
                        : 'bg-white text-slate-600 border border-slate-300'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{hasVoiceNoteAttached ? 'Audio 0:14' : 'Add Voice'}</span>
                  </button>
                </div>
              </div>

              {/* AI suggests box matching screenshot */}
              <div className="bg-teal-50/70 border border-teal-200 rounded-lg p-3 space-y-1 text-xs">
                <div className="flex items-center justify-between font-bold text-teal-900">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    <span>AI suggests: {aiSuggestion.category.toLowerCase()}</span>
                  </span>
                  <span className="text-[10px] bg-teal-200/80 text-teal-900 px-1.5 py-0.2 rounded">
                    {aiSuggestion.scheme}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-tight pt-0.5">
                  {aiSuggestion.explanation}
                </p>
              </div>

              {/* Duplicate alert if exists */}
              {nearbyDuplicateWarning && (
                <div className="bg-amber-50 border border-amber-300 rounded-lg p-2.5 text-xs text-amber-900 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Similar Active Requirement Found:</strong>
                    <div className="text-[11px] text-slate-700">
                      &quot;{nearbyDuplicateWarning.title}&quot; ({nearbyDuplicateWarning.id}) is already in GP agenda.
                      Your report will be linked to support prioritization!
                    </div>
                  </div>
                </div>
              )}

              {/* Review and submit button matching screenshot */}
              <button
                id="btn-review-and-submit"
                onClick={handleSubmit}
                className="w-full bg-[#007A87] hover:bg-[#006672] text-white text-xs font-bold py-2.5 px-4 rounded-lg shadow-sm transition-all cursor-pointer flex items-center justify-center space-x-1.5 active:scale-98"
              >
                <Send className="w-4 h-4" />
                <span>Review and submit</span>
              </button>

              {/* Submitted Confirmation Card */}
              {submittedRequest && (
                <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 space-y-2 animate-fadeIn">
                  <div className="flex items-center space-x-1.5 font-bold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Submitted Successfully! Request ID: {submittedRequest.id}</span>
                  </div>
                  <div className="text-[11px] text-slate-700 space-y-0.5">
                    <div>• Status: <strong>Field Verification Queue</strong></div>
                    <div>• Assigned Scheme: <strong>{submittedRequest.aiSuggestedScheme}</strong></div>
                    <div>• Location: {submittedRequest.locationDetails}</div>
                  </div>
                  <div className="pt-1 text-[11px] text-emerald-700 font-semibold">
                    Citizen can track progress in real-time under Scheme Feedback (Screen 7).
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Column 2: Service categories Card (Middle) matching screenshot */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-4">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight pb-3 border-b border-slate-100">
              Service categories
            </h3>

            <div className="space-y-2.5 mt-3">
              {SERVICE_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      if (cat === 'Water supply') handleAnalyzeText('We need water in Ward 2.');
                      else if (cat === 'Road / footpath') handleAnalyzeText('CC Road damaged near primary school.');
                      else if (cat === 'Drainage / waste') handleAnalyzeText('Drain overflowing near Anganwadi.');
                      else if (cat === 'Streetlight / electricity') handleAnalyzeText('Solar street light required at market.');
                      else handleAnalyzeText('Community pond desilting required.');
                    }}
                    className={`w-full text-left p-3 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-teal-50 border-teal-500 text-teal-900 shadow-xs'
                        : 'bg-slate-50/50 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{cat}</span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Helper */}
            <div className="mt-5 p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <strong className="text-slate-800 block">Citizen Tip:</strong>
              <div>
                Voice recognition operates in English, Hindi, and local dialects. Speak naturally and specify your village ward.
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: AI assistance, Location capture, Verification, Feedback loop (Right) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-4 space-y-5">
            <div>
              <h4 className="text-xs font-bold text-teal-700 tracking-wide uppercase">AI assistance</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Translate and classify the request. Citizen confirms the category and description.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-teal-700 tracking-wide uppercase">Location capture</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Record coordinates, accuracy and time. Allow a corrected pin or an asset selection.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-teal-700 tracking-wide uppercase">Verification</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Offer nearby existing requests, then route new reports to GP or field verification.
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <h4 className="text-xs font-bold text-teal-700 tracking-wide uppercase">Feedback loop</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Provide request ID, status and reason for decisions. Allow clarification or reopening.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigateToScreen('05')}
                className="w-full flex items-center justify-between p-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer"
              >
                <span>View Rainwater Opportunity Map (Screen 5)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
