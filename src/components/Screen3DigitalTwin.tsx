import React, { useState } from 'react';
import {
  Layers,
  Sun,
  Eye,
  Box,
  MapPin,
  Sparkles,
  CheckCircle2,
  Droplets,
  Building,
  ShieldAlert,
  Calendar,
  Compass,
  Zap,
  ArrowUpRight,
  Plus,
} from 'lucide-react';
import { GramPanchayat, DigitalTwinAsset, CitizenNeed } from '../types';

interface Screen3DigitalTwinProps {
  selectedGp: GramPanchayat;
  assets: DigitalTwinAsset[];
  onAddNeed: (need: CitizenNeed) => void;
  onNavigateToScreen: (screenId: '01' | '02' | '03' | '04' | '05' | '06' | '07') => void;
}

export const Screen3DigitalTwin: React.FC<Screen3DigitalTwinProps> = ({
  selectedGp,
  assets,
  onAddNeed,
  onNavigateToScreen,
}) => {
  const [is3DView, setIs3DView] = useState<boolean>(false);
  const [selectedAssetId, setSelectedAssetId] = useState<string>(assets[0]?.id || 'ASSET-01');

  // Layer toggles matching screenshot Page 3
  const [layerSvamitva, setLayerSvamitva] = useState<boolean>(true);
  const [layerTerrain, setLayerTerrain] = useState<boolean>(true);
  const [layerAssets, setLayerAssets] = useState<boolean>(true);
  const [layer3DHeights, setLayer3DHeights] = useState<boolean>(true);
  const [layerSolarSuitability, setLayerSolarSuitability] = useState<boolean>(true);

  const [gapNeedCreated, setGapNeedCreated] = useState<string | null>(null);

  const selectedAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];

  const handleCreateNeedFromGap = () => {
    if (!selectedAsset) return;

    let needCategory = 'Solar / public lighting';
    let title = `Rooftop Solar for ${selectedAsset.name}`;
    let desc = `SVAMITVA digital twin survey identified ${selectedAsset.solarSuitability.usableRoofAreaSqM} sq.m shaded-free roof. Estimated solar potential: ${selectedAsset.solarSuitability.potentialKwp} kWp saving ₹${selectedAsset.solarSuitability.estimatedAnnualSavingsInr.toLocaleString('en-IN')}/year.`;
    let cost = Math.round(selectedAsset.solarSuitability.potentialKwp * 50000);

    if (selectedAsset.waterServiceStatus !== 'Adequate') {
      needCategory = 'Drinking water';
      title = `Water supply augmentation for ${selectedAsset.name}`;
      desc = `Service gap detected: Current water status is "${selectedAsset.waterServiceStatus}". Immediate pipeline connection / booster pump required.`;
      cost = 180000;
    }

    const newNeed: CitizenNeed = {
      id: `NEED-GAP-${Date.now().toString().slice(-4)}`,
      gpId: selectedGp.id,
      village: selectedGp.villages[0] || 'Village',
      ward: selectedAsset.ward,
      category: needCategory as any,
      title,
      description: desc,
      locationDetails: `${selectedAsset.name} (SVAMITVA Parcel: ${selectedAsset.svamitvaParcelId})`,
      priority: 'High',
      estimatedCost: cost,
      status: 'Pending Review',
      submittedBy: 'Digital Twin Gap Analysis Engine',
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      lsdgTheme: needCategory === 'Drinking water' ? 'Water sufficiency' : 'Clean and green villages',
      aiSuggestedScheme: needCategory === 'Drinking water' ? 'Jal Jeevan Mission (JJM)' : 'PM Surya Ghar',
    };

    onAddNeed(newNeed);
    setGapNeedCreated(`Need created for ${selectedAsset.name} and added to GP Agenda!`);
    setTimeout(() => setGapNeedCreated(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header breadcrumb bar matching Page 3 */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-bold tracking-wider text-teal-700 uppercase font-mono">
              03 / GRAM PANCHAYAT PLANNING PLATFORM
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Digital twin, service gaps and solar potential
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Screen 3 · SVAMITVA layers within a wider GP map, with a 3D view where data supports it
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="px-2.5 py-1 rounded bg-slate-100 font-mono text-slate-700 border border-slate-200">
              SVAMITVA Base: <strong className="text-slate-900">Survey of India DGCA 5cm</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main 3-Column Layout from Screenshot Page 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Column 1: Village digital twin & 2D/3D Viewport (Left) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            {/* Dark Header */}
            <div className="bg-[#122A3F] text-white px-4 py-3 border-b border-slate-700 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold tracking-wide">Village digital twin</div>
                <div className="text-xs text-slate-300">
                  {selectedGp.name} / {selectedGp.villages[0]} / Abadi Core
                </div>
              </div>
              {/* 2D / 3D Viewport Switcher */}
              <div className="flex items-center space-x-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
                <button
                  id="btn-viewport-2d"
                  onClick={() => setIs3DView(false)}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                    !is3DView ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  2D Map
                </button>
                <button
                  id="btn-viewport-3d"
                  onClick={() => setIs3DView(true)}
                  className={`flex items-center space-x-1 px-3 py-1 rounded text-xs font-semibold transition-all ${
                    is3DView ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>3D Viewport</span>
                </button>
              </div>
            </div>

            {/* Interactive Canvas / Digital Twin Map */}
            <div
              className={`relative w-full h-[460px] overflow-hidden transition-all duration-500 select-none ${
                layerTerrain ? 'bg-[#EBF2E8]' : 'bg-slate-100'
              }`}
              style={{
                perspective: is3DView ? '1000px' : 'none',
              }}
            >
              {/* Map Surface container with 3D rotation if active */}
              <div
                className="w-full h-full relative transition-transform duration-700"
                style={{
                  transform: is3DView ? 'rotateX(54deg) rotateZ(-18deg) scale(1.05)' : 'none',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* SVAMITVA Parcel Cadastral Grid */}
                {layerSvamitva && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                    <defs>
                      <pattern id="parcel-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#688F4E" strokeWidth="1" strokeDasharray="3,3" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#parcel-grid)" />
                    {/* Contours & Roads */}
                    <path d="M 0 120 Q 250 80 500 160 T 900 110" fill="none" stroke="#D18F51" strokeWidth="8" />
                    <path d="M 320 0 Q 340 250 360 500" fill="none" stroke="#D18F51" strokeWidth="6" />
                    {/* JJM Water Pipeline trunk */}
                    <path d="M 20 180 Q 280 160 480 200 T 880 170" fill="none" stroke="#0284C7" strokeWidth="3" strokeDasharray="6,3" />
                  </svg>
                )}

                {/* Village Water Tank & Pond Catchment */}
                <div
                  className="absolute rounded-full border-2 border-dashed border-sky-400 bg-sky-200/50 flex items-center justify-center pointer-events-none"
                  style={{ left: '76%', top: '65%', width: '110px', height: '80px' }}
                >
                  <span className="text-[10px] font-bold text-sky-800">Pond Basin (Khasra 412)</span>
                </div>

                {/* Asset markers / 3D Buildings */}
                {assets.map((asset) => {
                  const isSelected = asset.id === selectedAssetId;
                  const hasSolarOverlay = layerSolarSuitability && asset.solarSuitability.feasible;
                  const heightPx = layer3DHeights ? Math.round(asset.heightMeters * 5.5) : 0;

                  return (
                    <div
                      key={asset.id}
                      onClick={() => setSelectedAssetId(asset.id)}
                      className={`absolute cursor-pointer transition-all duration-300 group`}
                      style={{
                        left: `${asset.x}%`,
                        top: `${asset.y}%`,
                        transform: 'translate(-50%, -50%)',
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      {/* 3D Extruded Building Box */}
                      <div
                        className={`relative rounded-md transition-all ${
                          isSelected
                            ? 'ring-3 ring-teal-500 shadow-xl'
                            : 'hover:ring-2 hover:ring-amber-400'
                        } ${
                          hasSolarOverlay
                            ? 'bg-amber-100 border-2 border-amber-500'
                            : 'bg-white border border-slate-400'
                        }`}
                        style={{
                          width: `${Math.max(48, Math.min(84, asset.roofAreaSqM / 4.5))}px`,
                          height: `${Math.max(40, Math.min(68, asset.roofAreaSqM / 5.5))}px`,
                          transform: is3DView
                            ? `translateZ(${heightPx}px) rotateZ(${isSelected ? '2deg' : '0deg'})`
                            : 'none',
                          boxShadow: is3DView
                            ? `0 ${heightPx}px 0 rgba(15, 34, 49, 0.4), 0 ${heightPx + 10}px 18px rgba(0,0,0,0.3)`
                            : undefined,
                        }}
                      >
                        {/* Rooftop Solar visual representation */}
                        {hasSolarOverlay && (
                          <div className="absolute inset-1 grid grid-cols-3 gap-0.5 bg-amber-400/40 rounded p-0.5">
                            <span className="bg-amber-500/70 rounded-xs"></span>
                            <span className="bg-amber-500/70 rounded-xs"></span>
                            <span className="bg-amber-500/70 rounded-xs"></span>
                            <span className="bg-amber-500/70 rounded-xs"></span>
                            <span className="bg-amber-500/70 rounded-xs"></span>
                            <span className="bg-amber-500/70 rounded-xs"></span>
                          </div>
                        )}

                        {/* Building Label & Icon */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-1 text-center">
                          {asset.type === 'Water Tank' ? (
                            <Droplets className="w-4 h-4 text-sky-600" />
                          ) : asset.type === 'School' ? (
                            <Building className="w-4 h-4 text-emerald-700" />
                          ) : (
                            <Building className="w-4 h-4 text-slate-700" />
                          )}
                          <span className="text-[9px] font-bold text-slate-800 leading-none truncate max-w-full mt-0.5">
                            {asset.name.split(' ')[0]}
                          </span>
                          {hasSolarOverlay && (
                            <span className="text-[8px] font-bold text-amber-900 bg-amber-200/90 px-1 rounded mt-0.5">
                              {asset.solarSuitability.potentialKwp} kWp
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Floating Pin / Tag */}
                      {isSelected && (
                        <div
                          className="absolute -top-7 left-1/2 -translate-x-1/2 bg-teal-800 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-md whitespace-nowrap flex items-center gap-1 z-30"
                          style={{
                            transform: is3DView ? `translateZ(${heightPx + 20}px) translateX(-50%)` : undefined,
                          }}
                        >
                          <MapPin className="w-3 h-3 text-teal-300" />
                          <span>{asset.name}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Map Legend Overlay matching screenshot */}
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs border border-slate-300 rounded-lg p-2.5 text-[11px] text-slate-700 shadow-sm space-y-1 z-20">
                <div className="font-bold text-slate-900 text-xs border-b border-slate-200 pb-1">
                  Layer Legend
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-xs border border-slate-500 bg-white"></span>
                  <span>Parcels + buildings (SVAMITVA)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-1.5 bg-[#D18F51]"></span>
                  <span>Roads + public assets</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-1 bg-[#0284C7] border-dashed"></span>
                  <span>JJM Pipeline + service gaps</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-xs bg-amber-400 border border-amber-600"></span>
                  <span>Rooftop solar overlay</span>
                </div>
              </div>

              {/* Viewport orientation badge */}
              <div className="absolute top-3 right-3 bg-slate-900/80 text-white px-2.5 py-1 rounded text-[11px] font-mono flex items-center space-x-1.5 z-20">
                <Compass className="w-3.5 h-3.5 text-emerald-400 animate-spin [animation-duration:8s]" />
                <span>{is3DView ? '3D Isometric • 45° Pitch' : '2D Ortho • Nadir 0°'}</span>
              </div>
            </div>

            {/* Selected asset inspection panel matching screenshot */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">
                    SVAMITVA Parcel ID: {selectedAsset.svamitvaParcelId}
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{selectedAsset.name}</h3>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="px-2 py-0.5 rounded bg-slate-200 font-medium text-slate-700">
                    Ward: {selectedAsset.ward}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                    Height: {selectedAsset.heightMeters}m
                  </span>
                </div>
              </div>

              {/* Solar preliminary estimate & Survey info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white p-3 rounded-lg border border-slate-200">
                <div className="space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-amber-800">
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span>Solar: preliminary estimate</span>
                  </div>
                  {selectedAsset.solarSuitability.feasible ? (
                    <div className="text-slate-600 space-y-0.5 pl-5 text-[11px]">
                      <div>
                        • Usable Roof Area: <strong>{selectedAsset.solarSuitability.usableRoofAreaSqM} sq.m</strong>
                      </div>
                      <div>
                        • Estimated Capacity:{' '}
                        <strong className="text-amber-700 font-bold">
                          {selectedAsset.solarSuitability.potentialKwp} kWp
                        </strong>{' '}
                        ({selectedAsset.solarSuitability.annualGenerationKwh.toLocaleString()} kWh/yr)
                      </div>
                      <div>
                        • Est. Annual Savings:{' '}
                        <strong className="text-emerald-700 font-bold">
                          ₹{selectedAsset.solarSuitability.estimatedAnnualSavingsInr.toLocaleString('en-IN')}
                        </strong>
                      </div>
                      <div>• Shading Loss: {selectedAsset.solarSuitability.shadingPercentage}% (Clear Horizon)</div>
                    </div>
                  ) : (
                    <div className="text-slate-500 pl-5 text-[11px]">
                      Not suitable for rooftop solar (Elevation structure/tank).
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-slate-700">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span>Survey date and accuracy</span>
                  </div>
                  <div className="text-slate-600 space-y-0.5 pl-5 text-[11px]">
                    <div>• Survey: {selectedAsset.surveyDate}</div>
                    <div>• Spatial Accuracy: {selectedAsset.surveyAccuracy}</div>
                    <div>
                      • Water Service:{' '}
                      <span
                        className={`font-semibold ${
                          selectedAsset.waterServiceStatus === 'Adequate'
                            ? 'text-emerald-700'
                            : 'text-rose-700'
                        }`}
                      >
                        {selectedAsset.waterServiceStatus}
                      </span>
                    </div>
                    <div>• Sanitation: {selectedAsset.sanitationStatus}</div>
                  </div>
                </div>
              </div>

              {/* Action Button: Create need from gap */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <button
                  id="btn-create-need-from-gap"
                  onClick={handleCreateNeedFromGap}
                  className="bg-[#007A87] hover:bg-[#006672] text-white text-xs font-bold py-2.5 px-5 rounded-lg shadow-sm transition-all cursor-pointer flex items-center space-x-1.5 active:scale-98"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create need from gap</span>
                </button>

                {gapNeedCreated && (
                  <div className="text-xs text-emerald-800 font-semibold flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{gapNeedCreated}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Column 2 & 3: Layer Controls & Data Assembly / Planning Output (Right) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Layer controls Box matching screenshot */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-4">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight pb-3 border-b border-slate-100">
              Layer controls
            </h3>

            <div className="space-y-2.5 mt-3">
              <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs">
                <span className="font-semibold text-slate-800">SVAMITVA / abadi</span>
                <input
                  type="checkbox"
                  checked={layerSvamitva}
                  onChange={(e) => setLayerSvamitva(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs">
                <span className="font-semibold text-slate-800">Terrain / whole GP</span>
                <input
                  type="checkbox"
                  checked={layerTerrain}
                  onChange={(e) => setLayerTerrain(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs">
                <span className="font-semibold text-slate-800">Assets / service coverage</span>
                <input
                  type="checkbox"
                  checked={layerAssets}
                  onChange={(e) => setLayerAssets(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs">
                <span className="font-semibold text-slate-800">3D / building heights</span>
                <input
                  type="checkbox"
                  checked={layer3DHeights}
                  onChange={(e) => setLayer3DHeights(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs">
                <span className="font-semibold text-slate-800">Solar suitability</span>
                <input
                  type="checkbox"
                  checked={layerSolarSuitability}
                  onChange={(e) => setLayerSolarSuitability(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Guidelines & Outputs matching screenshot Page 3 */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-4 space-y-4">
            <div>
              <h4 className="text-xs font-bold text-teal-700 tracking-wide uppercase">Data assembly</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Link parcels, assets and needs by GP code and geometry. Preserve survey date and source.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-teal-700 tracking-wide uppercase">Gap identification</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Compare verified service coverage against locally approved service standards.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-teal-700 tracking-wide uppercase">Solar assessment</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Use roof area, shading and irradiance. Engineer verifies structure and grid feasibility.
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <h4 className="text-xs font-bold text-teal-700 tracking-wide uppercase">Planning output</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Compare infrastructure scenarios, energy demand, operating cost and maintenance responsibility.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigateToScreen('04')}
                className="w-full flex items-center justify-between p-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer"
              >
                <span>Report Citizen Need with Geotags (Screen 4)</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
