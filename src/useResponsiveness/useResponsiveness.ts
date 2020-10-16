import { useState, useCallback, useEffect } from 'react';
import { ScreenProps } from '../types';

const DEFAULT_BREAKPOINTS = {
  xs: 0,
  mobile: 480,
  tablet: 768,
  desktop: 1180,
};

function getScreenData(breakpoints: any, sizes: any[]): ScreenProps {
  const width = globalThis.innerWidth || 1280;

  const size = sizes.find(([_, size]) => size < width)[0];

  const orientation = width > globalThis.innerHeight ? 'landscape' : 'portrait';

  const screenIsAtLeast = (
    breakpoint: string,
    andOrientation?: string
  ): boolean => {
    return (
      width >= breakpoints[breakpoint] &&
      (!andOrientation || andOrientation === orientation)
    );
  };

  const screenIsAtMost = (
    breakpoint: string,
    andOrientation?: string
  ): boolean => {
    return (
      width <= breakpoints[breakpoint] &&
      (!andOrientation || andOrientation === orientation)
    );
  };

  return {
    size,
    orientation,
    isMobile: screenIsAtMost('mobile'),
    isTablet: screenIsAtMost('tablet'),
    isDesktop: screenIsAtLeast('desktop'),
    screenIsAtLeast,
    screenIsAtMost,
  };
}

export default function useResponsiveness(breakpoints = DEFAULT_BREAKPOINTS) {
  const sizes = Object.entries(breakpoints).sort(
    ([aKey, aValue], [bKey, bValue]) => bValue - aValue
  );

  if (sizes[sizes.length - 1][1] !== 0) {
    sizes[sizes.length - 1][1] = 0;
  }

  const getScreen = useCallback(() => getScreenData(breakpoints, sizes), [
    breakpoints,
    sizes,
  ]);

  const [screen, setScreen] = useState(getScreen());

  useEffect(() => {
    const onResize = () => {
      const current = getScreen();

      if (
        current.size !== screen.size ||
        current.orientation !== screen.orientation
      ) {
        setScreen(current);
      }
    };

    globalThis.addEventListener('resize', onResize);

    return () => {
      globalThis.removeEventListener('resize', onResize);
    };
  }, [screen, setScreen, getScreen]);

  return screen;
}
