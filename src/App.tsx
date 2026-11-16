/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { type PhaseId } from './data/businessPlan';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { LabMethodologySection } from './components/LabMethodologySection';
import { AudienceSection } from './components/AudienceSection';
import { RoadmapSection } from './components/RoadmapSection';
import { IdentityValuesSection } from './components/IdentityValuesSection';
import { SoftwareProvidersSection } from './components/SoftwareProvidersSection';
import { ContactConversionSection } from './components/ContactConversionSection';
import { Footer } from './components/Footer';
import { ConfidentialityModal } from './components/ConfidentialityModal';

export default function App() {
  const [selectedPhase, setSelectedPhase] = useState<PhaseId>('fase-2');
  const [planModalOpen, setPlanModalOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectPhaseAndScroll = (phase: PhaseId) => {
    setSelectedPhase(phase);
    scrollToSection('contacto');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#080526]">
      <Navbar onOpenDiagnostic={() => scrollToSection('contacto')} />

      <main className="flex-1">
        <HeroSection
          onStartRoadmap={() => scrollToSection('hoja-de-ruta')}
          onContactClick={() => scrollToSection('contacto')}
        />

        <LabMethodologySection />

        <AudienceSection onSelectPersonaPhase={handleSelectPhaseAndScroll} />

        <RoadmapSection
          selectedPhase={selectedPhase}
          onSelectPhase={handleSelectPhaseAndScroll}
        />

        <IdentityValuesSection />

        <SoftwareProvidersSection />

        <ContactConversionSection
          selectedPhase={selectedPhase}
          onPhaseChange={setSelectedPhase}
          onOpenPlanModal={() => setPlanModalOpen(true)}
        />
      </main>

      <Footer onOpenPlanModal={() => setPlanModalOpen(true)} />

      <ConfidentialityModal
        open={planModalOpen}
        onClose={() => setPlanModalOpen(false)}
      />
    </div>
  );
}
