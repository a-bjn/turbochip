import ChipTuningCalculator from "./components/chip-tunning-calculator";
import CommonIssues from "./components/common-issues";
import Hero from "./components/hero";
import ProblemSolver from "./components/problem-solver";
import ToolsSection from "./components/tools-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#111111] text-white">
      <Hero />
      <ToolsSection />
      <CommonIssues />
      <ProblemSolver />
      <ChipTuningCalculator />
    </div>
  )
}
