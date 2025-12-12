import Hero from '@/components/landing/Hero';
import HorizontalScroll from '@/components/landing/HorizontalScroll'; // The NEW GSAP one
import NeuralFeatures from '@/components/landing/NeuralFeatures'; // The NEW Brain one
import DraggableCanvas from '@/components/landing/DraggableCanvas';
export default function Home() {
  return (
    <main className="min-h-screen bg-[#030014] overflow-x-hidden">
      <Hero />
      <HorizontalScroll />
      <NeuralFeatures />
      <DraggableCanvas />
    </main>
  );
}