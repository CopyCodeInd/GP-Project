import React, { useState } from 'react';
import { Header, ScreenId, UserRole } from './components/Header';
import { Screen1Consultation } from './components/Screen1Consultation';
import { Screen2SchemeCorrelation } from './components/Screen2SchemeCorrelation';
import { Screen3DigitalTwin } from './components/Screen3DigitalTwin';
import { Screen4CitizenRequest } from './components/Screen4CitizenRequest';
import { Screen5RainwaterHarvesting } from './components/Screen5RainwaterHarvesting';
import { Screen6AllGPAgenda } from './components/Screen6AllGPAgenda';
import { Screen7CitizenSchemes } from './components/Screen7CitizenSchemes';
import { GpdpExportModal } from './components/GpdpExportModal';
import { HelpGuideModal } from './components/HelpGuideModal';
import {
  GRAM_PANCHAYATS,
  INITIAL_CITIZEN_NEEDS,
  SANCTIONED_WORKS,
  DIGITAL_TWIN_ASSETS,
  RAINWATER_CANDIDATES,
  INITIAL_OVERLAPS,
  SCHEMES_INFO_DIRECTORY,
  INITIAL_CITIZEN_PROFILE,
  INITIAL_GRIEVANCES,
} from './data/mockData';
import {
  GramPanchayat,
  CitizenNeed,
  SanctionedSchemeWork,
  DigitalTwinAsset,
  RainwaterCandidate,
  OverlapItem,
  GovernmentSchemeInfo,
  CitizenProfile,
  GrievanceFeedback,
} from './types';

export default function App() {
  // Navigation & Role State
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('01');
  const [userRole, setUserRole] = useState<UserRole>('gp_official');
  const [selectedGp, setSelectedGp] = useState<GramPanchayat>(GRAM_PANCHAYATS[0]);

  // Core App Data State
  const [needs, setNeeds] = useState<CitizenNeed[]>(INITIAL_CITIZEN_NEEDS);
  const [sanctionedWorks, setSanctionedWorks] = useState<SanctionedSchemeWork[]>(SANCTIONED_WORKS);
  const [assets, setAssets] = useState<DigitalTwinAsset[]>(DIGITAL_TWIN_ASSETS);
  const [rainwaterCandidates, setRainwaterCandidates] = useState<RainwaterCandidate[]>(RAINWATER_CANDIDATES);
  const [overlaps, setOverlaps] = useState<OverlapItem[]>(INITIAL_OVERLAPS);
  const [schemes] = useState<GovernmentSchemeInfo[]>(SCHEMES_INFO_DIRECTORY);
  const [citizenProfile, setCitizenProfile] = useState<CitizenProfile>(INITIAL_CITIZEN_PROFILE);
  const [grievances, setGrievances] = useState<GrievanceFeedback[]>(INITIAL_GRIEVANCES);

  // Modals
  const [isGpdpModalOpen, setIsGpdpModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  // Toast Notice State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handlers
  const handleAddNeed = (newNeed: CitizenNeed) => {
    setNeeds((prev) => [newNeed, ...prev]);
    showToast(`Saved to GP Agenda: "${newNeed.title.slice(0, 36)}..."`);

    // Intelligent check: if it relates to water or ponds, automatically flag overlap or convergence
    const lower = newNeed.title.toLowerCase();
    if (lower.includes('water') || lower.includes('tap') || lower.includes('pipeline')) {
      const newOvl: OverlapItem = {
        id: `OVL-${Date.now().toString().slice(-2)}`,
        proposedNeedId: newNeed.id,
        proposedTitle: newNeed.title,
        matchedWorkId: 'W-JJM-104',
        matchedSchemeName: 'Jal Jeevan Mission (JJM) - Rural Water',
        gpName: selectedGp.name,
        type: 'CONVERGENCE_OPPORTUNITY',
        confidenceScore: 0.94,
        aiExplanation:
          'High convergence synergy with active JJM contract. Pipe extension directly taps into the 50kL overhead reservoir trunk network.',
        officerDecision: 'Propose Convergence Package',
        assignedOmOwner: 'Village Water & Sanitation Committee (VWSC)',
        lifecycleCostInr: newNeed.estimatedCost,
      };
      setOverlaps((prev) => [newOvl, ...prev]);
    }
  };

  const handleAddWorkLink = (workId: string, needId: string) => {
    setSanctionedWorks((prev) =>
      prev.map((w) =>
        w.id === workId ? { ...w, linkedNeedIds: [...w.linkedNeedIds, needId] } : w
      )
    );
    showToast(`Linked ${workId} to requirement ${needId}`);
  };

  const handleRunOverlapCheck = () => {
    showToast('Overlap Engine synchronized 6 works and evaluated convergence opportunities.');
  };

  const handleUpdateOverlapDecision = (
    overlapId: string,
    decision: 'Keep Separate' | 'Link as Duplicate' | 'Propose Convergence Package',
    reason: string,
    omOwner: string,
    lifecycleCost: number
  ) => {
    setOverlaps((prev) =>
      prev.map((o) =>
        o.id === overlapId
          ? {
              ...o,
              officerDecision: decision,
              officerReason: reason,
              assignedOmOwner: omOwner,
              lifecycleCostInr: lifecycleCost,
              reviewedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : o
      )
    );
    showToast(`Officer decision "${decision}" recorded for ${overlapId}`);
  };

  const handleUpdateProfile = (newProfile: CitizenProfile) => {
    setCitizenProfile(newProfile);
    showToast(`Citizen profile updated for ${newProfile.name}. Scheme eligibility re-calculated!`);
  };

  const handleAddGrievance = (grievance: GrievanceFeedback) => {
    setGrievances((prev) => [grievance, ...prev]);
    showToast(`Grievance ticket ${grievance.id} submitted to District Portal.`);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-slate-900 flex flex-col font-sans selection:bg-teal-200">
      {/* Top Header with GP picker, role switcher, screen navigator */}
      <Header
        currentScreen={currentScreen}
        onSelectScreen={setCurrentScreen}
        selectedGp={selectedGp}
        allGps={GRAM_PANCHAYATS}
        onSelectGp={setSelectedGp}
        userRole={userRole}
        onChangeRole={setUserRole}
        onOpenGpdpExport={() => setIsGpdpModalOpen(true)}
        onOpenHelp={() => setIsHelpModalOpen(true)}
      />

      {/* Main Content Area rendering the active screen */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {currentScreen === '01' && (
          <Screen1Consultation
            selectedGp={selectedGp}
            needs={needs}
            onAddNeed={handleAddNeed}
            onNavigateToScreen={setCurrentScreen}
          />
        )}

        {currentScreen === '02' && (
          <Screen2SchemeCorrelation
            selectedGp={selectedGp}
            sanctionedWorks={sanctionedWorks}
            needs={needs}
            overlaps={overlaps}
            onAddWorkLink={handleAddWorkLink}
            onRunOverlapCheck={handleRunOverlapCheck}
            onNavigateToScreen={setCurrentScreen}
          />
        )}

        {currentScreen === '03' && (
          <Screen3DigitalTwin
            selectedGp={selectedGp}
            assets={assets}
            onAddNeed={handleAddNeed}
            onNavigateToScreen={setCurrentScreen}
          />
        )}

        {currentScreen === '04' && (
          <Screen4CitizenRequest
            selectedGp={selectedGp}
            existingNeeds={needs}
            onAddNeed={handleAddNeed}
            onNavigateToScreen={setCurrentScreen}
          />
        )}

        {currentScreen === '05' && (
          <Screen5RainwaterHarvesting
            selectedGp={selectedGp}
            candidates={rainwaterCandidates}
            onAddNeed={handleAddNeed}
            onNavigateToScreen={setCurrentScreen}
          />
        )}

        {currentScreen === '06' && (
          <Screen6AllGPAgenda
            selectedGp={selectedGp}
            allGps={GRAM_PANCHAYATS}
            overlaps={overlaps}
            needs={needs}
            onUpdateOverlapDecision={handleUpdateOverlapDecision}
            onNavigateToScreen={setCurrentScreen}
          />
        )}

        {currentScreen === '07' && (
          <Screen7CitizenSchemes
            selectedGp={selectedGp}
            schemes={schemes}
            citizenProfile={citizenProfile}
            onUpdateProfile={handleUpdateProfile}
            grievances={grievances}
            onAddGrievance={handleAddGrievance}
            onNavigateToScreen={setCurrentScreen}
          />
        )}
      </main>

      {/* Floating Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xl border border-slate-700 flex items-center space-x-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <GpdpExportModal
        isOpen={isGpdpModalOpen}
        onClose={() => setIsGpdpModalOpen(false)}
        selectedGp={selectedGp}
        needs={needs}
        works={sanctionedWorks}
      />

      <HelpGuideModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        onSelectScreen={setCurrentScreen}
      />

      {/* Official Government Footer */}
      <footer className="bg-[#0B1722] text-slate-400 text-xs py-4 px-6 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-white">Gram Panchayat Planning Platform (GPDP)</span>
            <span className="text-slate-600">|</span>
            <span>Ministry of Panchayati Raj, Government of India</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px] text-slate-400">
            <span>SVAMITVA Spatial Data V2</span>
            <span>•</span>
            <span>PAI 2.0 Aligned</span>
            <span>•</span>
            <span>PFMS / e-GramSwaraj Integrated</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
