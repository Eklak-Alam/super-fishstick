'use client';
import { ReactLenis } from 'lenis/react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef } from 'react';

export default function SmoothScrollLayout({ children }) {
  const pathname = usePathname();
  const lenisRef = useRef(null);

  // 1. Force browser to handle scroll manually (prevents jumpiness)
  useLayoutEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  // 2. Reset scroll on navigation
  useEffect(() => {
    if (lenisRef.current?.lenis) {
      lenisRef.current.lenis.scrollTo(0, { immediate: true });
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <ReactLenis 
      ref={lenisRef} 
      root 
      options={{ 
        lerp: 0.1, 
        duration: 1.5, 
        smoothTouch: true,
        orientation: 'vertical', 
        gestureOrientation: 'vertical'
      }}
    >
      {/* FIX: Removed mode="wait". 
         This stops the "Black Screen" gap. The new page loads immediately.
      */}
      <AnimatePresence>
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          /* FIX: Removed exit animation.
             We don't want the old page to fade out slowly; we want the new one to show up NOW.
          */
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </ReactLenis>
  );
}