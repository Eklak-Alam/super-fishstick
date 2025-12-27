import Hero from '@/components/landing/Hero';
import HorizontalScroll from '@/components/landing/HorizontalScroll'; // The NEW GSAP one
import NeuralFeatures from '@/components/landing/NeuralFeatures'; // The NEW Brain one
import DraggableCanvas from '@/components/landing/DraggableCanvas';
import BentoGrid from '@/components/landing/BentoGrid';
import Navbar from '@/components/global/Navbar';
import Footer from '@/components/global/Footer';


export default function Home() {
  return (
    <main className="min-h-screen bg-[#020202] overflow-x-hidden">
      {/* <Navbar /> */}
      <Hero />
      <HorizontalScroll />
      <BentoGrid />
      <NeuralFeatures />
      <DraggableCanvas />
    </main>
  );
}