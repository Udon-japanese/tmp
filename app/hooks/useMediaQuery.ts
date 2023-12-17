import { useEffect, useState } from 'react';

export default function useMediaQuery() {
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop' | null>(
    null
  );
  const [breakpoint, setBreakpoint] = useState<{
    isSm: boolean;
    isMd: boolean;
    isLg: boolean;
    isXl: boolean;
    is2xl: boolean;
  } | null>(null);
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    const checkDevice = () => {
      if (window.matchMedia('(max-width: 640px)').matches) {
        setDevice('mobile');
      } else if (
        window.matchMedia('(min-width: 641px) and (max-width: 1024px)').matches
      ) {
        setDevice('tablet');
      } else {
        setDevice('desktop');
      }

      const calcBreakPoint = (width: number) => {
        return {
          isSm: width >= 640,
          isMd: width >= 768,
          isLg: width >= 1024,
          isXl: width >= 1280,
          is2xl: width >= 1536,
        };
      };

      const width = window.innerWidth;
      const height = window.innerHeight;

      setDimensions({ width, height });
      setBreakpoint(calcBreakPoint(width));
    };

    checkDevice();

    window.addEventListener('resize', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  return {
    device,
    width: dimensions?.width,
    height: dimensions?.height,
    isMobile: device === 'mobile',
    isTablet: device === 'tablet',
    isDesktop: device === 'desktop',
    isSm: breakpoint?.isSm,
    isMd: breakpoint?.isMd,
    isLg: breakpoint?.isLg,
    isXl: breakpoint?.isXl,
    is2xl: breakpoint?.is2xl,
  };
}
