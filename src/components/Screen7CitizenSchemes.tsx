import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  FileCheck,
  Send,
  User,
  ShieldCheck,
  Building,
  HelpCircle,
  MessageSquare,
  RefreshCw,
  X,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import {
  GramPanchayat,
  CitizenProfile,
  GovernmentSchemeInfo,
  GrievanceFeedback,
} from '../types';

interface Screen7CitizenSchemesProps {
  selectedGp: GramPanchayat;
  schemes: GovernmentSchemeInfo[];
  citizenProfile: CitizenProfile;
  onUpdateProfile: (profile: CitizenProfile) => void;
  grievances: GrievanceFeedback[];
  onAddGrievance: (grievance: GrievanceFeedback) => void;
  onNavigateToScreen: (screenId: '01' | '02' | '03' | '04' | '05' | '06' | '07') => void;
}

export const Screen7CitizenSchemes: React.FC<Screen7CitizenSchemesProps> = ({
  selectedGp,
  schemes,
  citizenProfile,
  onUpdateProfile,
  grievances,
  onAddGrievance,
  onNavigateToScreen,
}) => {
  const [selectedSchemeCode, setSelectedSchemeCode] = useState<string>('PM-SURYA');
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);

  // Profile Form state
  const [profileForm, setProfileForm] = useState<CitizenProfile>(citizenProfile);

  // Feedback / Grievance form state
  const [feedbackType, setFeedbackType] = useState<
    'Delayed Benefit' | 'Payment Pending' | 'Quality Issue' | 'Application Stuck' | 'Exclusion Error'
  >('Delayed Benefit');
  const [feedbackText, setFeedbackText] = useState(
    'Rooftop solar subsidy application submitted on portal 6 weeks ago, awaiting DISCOM technical meter inspection.'
  );
  const [ticketCreatedMessage, setTicketCreatedMessage] = useState<string | null>(null);

  // Active scheme details
  const activeScheme = schemes.find((s) => s.code === selectedSchemeCode) || schemes[0];

  // Calculate Eligibility Score and Reasons for each scheme based on profile
  const getSchemeEligibility = (schemeCode: string) => {
    switch (schemeCode) {
      case 'JJM':
        return {
          eligible: !citizenProfile.hasFunctionalTap,
          score: !citizenProfile.hasFunctionalTap ? 98 : 45,
          reason: !citizenProfile.hasFunctionalTap
            ? 'Household currently has no piped tap connection. Priority 1 under Har Ghar Jal mission.'
            : 'Household already recorded with active tap connection.',
        };
      case 'PM-SURYA':
        return {
          eligible: citizenProfile.hasElectricityConnection,
          score: citizenProfile.hasElectricityConnection ? 95 : 30,
          reason:
            citizenProfile.hasElectricityConnection
              ? `Domestic consumer with avg monthly bill ₹${citizenProfile.monthlyElectricityBill}. Eligible for up to ₹78,000 direct DBT subsidy for 2-3 kW system.`
              : 'Requires grid domestic connection first.',
        };
      case 'PM-KUSUM':
        return {
          eligible: citizenProfile.landHoldingAcres > 0 && citizenProfile.hasAgriculturalPump,
          score: citizenProfile.landHoldingAcres > 0 ? 92 : 20,
          reason:
            citizenProfile.landHoldingAcres > 0
              ? `Small farmer (${citizenProfile.landHoldingAcres} acres) with irrigation demand. 60% Central + State subsidy available for solar pump.`
              : 'Requires agricultural land record in GP.',
        };
      case 'PMAY-G':
        return {
          eligible: citizenProfile.houseType === 'Kutcha' || citizenProfile.houseType === 'Semi-Pucca',
          score: citizenProfile.houseType === 'Kutcha' ? 96 : citizenProfile.houseType === 'Semi-Pucca' ? 82 : 15,
          reason:
            citizenProfile.houseType !== 'Pucca'
              ? `Household residing in ${citizenProfile.houseType} dwelling and BPL category. Eligible for ₹1.20 Lakh grant.`
              : 'Already owns pucca dwelling.',
        };
      case 'DAY-NRLM':
        return {
          eligible: citizenProfile.isShgMember,
          score: citizenProfile.isShgMember ? 94 : 40,
          reason: citizenProfile.isShgMember
            ? 'Active member of Women SHG. Eligible for Lakhpati Didi enterprise seed capital & ₹1.5L CIF loan.'
            : 'Join a local Gram Panchayat SHG to access benefits.',
        };
      case 'SBM-G':
        return {
          eligible: !citizenProfile.hasToilet,
          score: !citizenProfile.hasToilet ? 95 : 30,
          reason: !citizenProfile.hasToilet
            ? 'Identified for Individual Household Latrine (IHHL) incentive of ₹12,000.'
            : 'Toilet already constructed under SBM.',
        };
      default:
        return {
          eligible: true,
          score: 85,
          reason: 'Eligible based on general GPDP rural residency rules.',
        };
    }
  };

  const currentEligibility = getSchemeEligibility(activeScheme.code);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(profileForm);
    setShowProfileModal(false);
  };

  const handleSubmitFeedback = () => {
    const newTkt: GrievanceFeedback = {
      id: `TKT-2026-${Date.now().toString().slice(-3)}`,
      citizenName: citizenProfile.name,
      schemeCode: activeScheme.code,
      schemeName: activeScheme.name,
      issueType: feedbackType,
      description: feedbackText,
      dateSubmitted: new Date().toISOString().split('T')[0],
      status: 'Open',
    };
    onAddGrievance(newTkt);
    setShowFeedbackModal(false);
    setTicketCreatedMessage(`Grievance ticket created (${newTkt.id}). Routed to District Nodal Officer.`);
    setTimeout(() => setTicketCreatedMessage(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header breadcrumb bar matching Page 22 */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-bold tracking-wider text-teal-700 uppercase font-mono">
              07 / GRAM PANCHAYAT PLANNING PLATFORM
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Citizen scheme eligibility and feedback
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Screen 7 · My Eligible Schemes connects personal needs to scheme guidance and tracked feedback
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="px-2.5 py-1 rounded bg-slate-100 font-mono text-slate-700 border border-slate-200">
              Citizen: <strong>{citizenProfile.name}</strong> ({citizenProfile.economicCategory})
            </span>
          </div>
        </div>
      </div>

      {/* Main 3-Column Layout from Screenshot Page 22 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Column 1: My Eligible Schemes Card (Left) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            {/* Dark Header */}
            <div className="bg-[#122A3F] text-white px-4 py-3 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold tracking-wide">My Eligible Schemes</span>
                <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                  {citizenProfile.ward}
                </span>
              </div>
              <div className="text-xs text-slate-300 mt-1">
                {selectedGp.name} / {citizenProfile.village} / {citizenProfile.ward}
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* Check / update my profile button matching screenshot */}
              <button
                id="btn-update-profile"
                onClick={() => {
                  setProfileForm(citizenProfile);
                  setShowProfileModal(true);
                }}
                className="w-full bg-[#007A87] hover:bg-[#006672] text-white text-xs font-bold py-2.5 px-4 rounded-lg shadow-sm transition-all cursor-pointer text-center"
              >
                Check / update my profile
              </button>

              <div className="text-[11px] text-slate-500 font-medium px-1">
                Location, household details and relevant scheme questions
              </div>

              {/* Scheme match cards list */}
              <div className="space-y-2.5 pt-1">
                <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>Scheme match</span>
                  <span className="text-[11px] text-teal-700 font-medium">Auto-scored by AI</span>
                </div>

                {schemes.slice(0, 5).map((scheme) => {
                  const elig = getSchemeEligibility(scheme.code);
                  const isSelected = selectedSchemeCode === scheme.code;

                  return (
                    <div
                      key={scheme.code}
                      onClick={() => setSelectedSchemeCode(scheme.code)}
                      className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                        isSelected
                          ? 'border-teal-500 bg-teal-50/60 shadow-xs ring-1 ring-teal-400/30'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{scheme.name}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            elig.score >= 80
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {elig.score >= 80 ? 'Likely eligible' : 'More details'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                        {scheme.benefitSummary}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Final decision note matching screenshot */}
              <div className="text-[11px] text-slate-500 italic pt-1">
                Final decision: official verification by Line Department & Gram Sabha
              </div>

              {/* Submit scheme feedback button matching screenshot */}
              <button
                id="btn-submit-scheme-feedback"
                onClick={() => setShowFeedbackModal(true)}
                className="w-full bg-[#007A87] hover:bg-[#006672] text-white text-xs font-bold py-2.5 px-4 rounded-lg shadow-sm transition-all cursor-pointer text-center active:scale-98"
              >
                Submit scheme feedback
              </button>

              {ticketCreatedMessage && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{ticketCreatedMessage}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Column 2: Scheme details / actions Card (Middle) matching screenshot */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-4 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight pb-2 border-b border-slate-100">
              Scheme details / actions
            </h3>

            <div className="space-y-2">
              <button
                onClick={() => {
                  const el = document.getElementById('scheme-details-view');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-800 transition-colors"
              >
                Why this scheme matches
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('documents-view');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-800 transition-colors"
              >
                Documents / next steps
              </button>

              <button
                onClick={() => setShowFeedbackModal(true)}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-800 transition-colors"
              >
                Benefit or service feedback
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('grievance-history-view');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-800 transition-colors"
              >
                Track ticket / officer reply
              </button>

              <button
                onClick={() => {
                  alert('Escalation ticket flagged to District Magistrate / CDO portal.');
                }}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-800 transition-colors"
              >
                Clarify / reopen / escalate
              </button>
            </div>
          </div>
        </div>

        {/* Column 3: Eligibility check, Scheme feedback, Resolution workflow (Right) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-4 space-y-5">
            <div>
              <h4 className="text-xs font-bold text-teal-700 tracking-wide uppercase">Eligibility check</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Use current official rules and citizen-confirmed details. Show reasons, missing information and rule date.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-teal-700 tracking-wide uppercase">Scheme feedback</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Report delays, missing benefits, service quality or eligibility errors. Attach a photo, voice note or text.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-teal-700 tracking-wide uppercase">Resolution workflow</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Issue a ticket, route it to the responsible office and show updates. Allow a citizen reply or escalation.
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <h4 className="text-xs font-bold text-teal-700 tracking-wide uppercase">Illustrative example</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                A resident sees a possible scheme match, follows its application route, then tracks a delayed-benefit complaint.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigateToScreen('01')}
                className="w-full flex items-center justify-between p-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer"
              >
                <span>Return to PM–GP Consultation (Screen 1)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Deep Scheme Inspection & Documents View */}
      <div id="scheme-details-view" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-mono text-teal-700 font-bold uppercase">
              Selected: {activeScheme.code} • {activeScheme.ministry}
            </span>
            <h3 className="text-lg font-bold text-slate-900">{activeScheme.name}</h3>
          </div>
          <a
            href={activeScheme.officialPortalUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg shadow-xs"
          >
            <span>Open Official Application Route</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          {/* Why this scheme matches */}
          <div className="bg-teal-50/50 border border-teal-200 rounded-xl p-4 space-y-2">
            <h4 className="font-bold text-teal-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Why This Scheme Matches Your Household:</span>
            </h4>
            <p className="text-slate-700 text-xs leading-relaxed">{currentEligibility.reason}</p>

            <div className="mt-3 pt-3 border-t border-teal-200/80 space-y-1.5">
              <div className="text-slate-500 font-medium">Scheme Subsidy / Entitlement:</div>
              <div className="text-sm font-bold text-emerald-800">{activeScheme.benefitSummary}</div>
            </div>
          </div>

          {/* Required Documents Checklist */}
          <div id="documents-view" className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-slate-600" />
              <span>Required Documents & Next Steps:</span>
            </h4>
            <ul className="space-y-1.5 text-slate-600 pt-1">
              {activeScheme.requiredDocuments.map((doc, idx) => (
                <li key={idx} className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Citizen Grievance Tracker & Timeline */}
      <div id="grievance-history-view" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Tracked Benefit Grievances & Service Quality Tickets
            </h3>
            <p className="text-xs text-slate-500">Live resolution workflow with responsible block/district offices</p>
          </div>
          <button
            onClick={() => setShowFeedbackModal(true)}
            className="text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200 px-3 py-1.5 rounded-lg hover:bg-teal-100"
          >
            + New Feedback Ticket
          </button>
        </div>

        <div className="space-y-3">
          {grievances.map((g) => (
            <div key={g.id} className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-bold text-slate-900">
                  <span className="font-mono text-slate-500 mr-2">{g.id}</span>
                  {g.schemeName} ({g.issueType})
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    g.status === 'Resolved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : g.status === 'Under Investigation'
                      ? 'bg-sky-100 text-sky-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {g.status}
                </span>
              </div>

              <p className="text-slate-600 text-[11px]">{g.description}</p>

              {g.officerReply && (
                <div className="bg-white p-2.5 rounded border border-slate-200 text-[11px] text-slate-700 space-y-1">
                  <div className="font-semibold text-teal-800 flex items-center justify-between">
                    <span>Officer Response:</span>
                    <span className="text-[10px] text-slate-400">{g.replyDate}</span>
                  </div>
                  <p>{g.officerReply}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Update Citizen Profile */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveProfile}
            className="bg-white rounded-xl max-w-lg w-full p-5 shadow-xl border border-slate-200 space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Update Citizen Household Profile</h3>
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Citizen Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-1.5"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Economic Status</label>
                  <select
                    value={profileForm.economicCategory}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, economicCategory: e.target.value as any })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded p-1.5 font-semibold"
                  >
                    <option value="BPL">BPL (Below Poverty Line)</option>
                    <option value="Antyodaya (AAY)">Antyodaya (AAY)</option>
                    <option value="Small & Marginal Farmer">Small & Marginal Farmer</option>
                    <option value="APL">APL</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">House Type</label>
                  <select
                    value={profileForm.houseType}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, houseType: e.target.value as any })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded p-1.5"
                  >
                    <option value="Kutcha">Kutcha (Mud/Thatch)</option>
                    <option value="Semi-Pucca">Semi-Pucca (Tiles/Tin)</option>
                    <option value="Pucca">Pucca (Concrete/Brick)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Landholding (Acres)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={profileForm.landHoldingAcres}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, landHoldingAcres: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded p-1.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={profileForm.hasFunctionalTap}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, hasFunctionalTap: e.target.checked })
                    }
                    className="rounded text-teal-600"
                  />
                  <span>Has Piped Tap Connection</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={profileForm.isShgMember}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, isShgMember: e.target.checked })
                    }
                    className="rounded text-teal-600"
                  />
                  <span>Women SHG Member</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={profileForm.hasAgriculturalPump}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, hasAgriculturalPump: e.target.checked })
                    }
                    className="rounded text-teal-600"
                  />
                  <span>Owns Agri Irrigation Pump</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={profileForm.hasElectricityConnection}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, hasElectricityConnection: e.target.checked })
                    }
                    className="rounded text-teal-600"
                  />
                  <span>Grid Electricity Meter</span>
                </label>
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-teal-700 text-white text-xs font-semibold rounded-lg hover:bg-teal-800"
              >
                Save Profile & Re-calculate
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Submit Feedback / Grievance */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-5 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Submit Scheme Benefit or Service Feedback</h3>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Scheme</label>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded font-semibold text-slate-900">
                  {activeScheme.name} ({activeScheme.code})
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Issue Category</label>
                <select
                  value={feedbackType}
                  onChange={(e) => setFeedbackType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-semibold"
                >
                  <option value="Delayed Benefit">Delayed Benefit</option>
                  <option value="Payment Pending">Payment / Subsidy Pending</option>
                  <option value="Quality Issue">Quality Issue / Defective Work</option>
                  <option value="Application Stuck">Application Stuck in Verification</option>
                  <option value="Exclusion Error">Exclusion Error / Wrongly Denied</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Description of Grievance</label>
                <textarea
                  rows={3}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowFeedbackModal(false)}
                className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitFeedback}
                className="px-4 py-1.5 bg-teal-700 text-white text-xs font-semibold rounded-lg hover:bg-teal-800"
              >
                Submit Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
