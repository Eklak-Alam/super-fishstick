import Hero from '@/components/landing/Hero';
import HorizontalScroll from '@/components/landing/HorizontalScroll'; 
import NeuralFeatures from '@/components/landing/NeuralFeatures'; 
import DraggableCanvas from '@/components/landing/DraggableCanvas';
import BentoGrid from '@/components/landing/BentoGrid';
import ProblemSection from '@/components/landing/ProblemSection';
import OrangeProtocol from '@/components/landing/Problem';
import CleanInterface from '@/components/landing/Problem';
import PremiumOrange from '@/components/landing/Problem';
import ProfessionalProblemSection from '@/components/landing/Problem';

export default function Home() {
  return (
    // FIX 1: Removed 'overflow-x-clip/hidden'. 
    // We rely on globals.css (body) to handle overflow. 
    // This allows the Hero to be 'sticky' relative to the window.
    <div className="w-full bg-[#020202] overflow-x-hidden">
      
      {/* 1. The Sticky Hero 
          It stays fixed at the top (z-0) while you scroll.
      */}
      <Hero />

      {/* 2. The Scrolling Content
          We wrap everything else in a 'relative z-10' div.
          This makes it slide ON TOP of the sticky Hero.
      */}
      <div className="relative z-10 bg-[#020202]">
        <ProfessionalProblemSection />
        <ProblemSection />
        <HorizontalScroll />
        <BentoGrid />
        <NeuralFeatures />
        <DraggableCanvas />
      </div>

    </div>
  );
}