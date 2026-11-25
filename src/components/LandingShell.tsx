"use client";

import { useState } from "react";
import type { ProgramOption } from "@/data/academyContent";
import { Navbar } from "./Navbar";
import { HeroSection } from "./HeroSection";
import { BenefitsAndUrgencySection } from "./BenefitsAndUrgencySection";
import { ToolsConstellation } from "./ToolsConstellation";
import { PlansSection } from "./PlansSection";
import { UseCasesSection } from "./UseCasesSection";
import { RegistrationForm } from "./RegistrationForm";
import { FaqAndFooter } from "./FaqAndFooter";

export function LandingShell() {
  const [selectedProgram, setSelectedProgram] =
    useState<ProgramOption>("Liftoff (12 horas)");

  return (
    <>
      <Navbar />
      <main id="contenido-principal">
        <HeroSection onSelectProgram={setSelectedProgram} />
        <BenefitsAndUrgencySection />
        <ToolsConstellation />
        <PlansSection
          selectedProgram={selectedProgram}
          onChooseProgram={setSelectedProgram}
        />
        <UseCasesSection />
        <RegistrationForm
          selectedProgram={selectedProgram}
          onChangeProgram={setSelectedProgram}
        />
      </main>
      <FaqAndFooter />
    </>
  );
}
