import { useRef, useState } from 'react';
import { ScrollView, Keyboard } from 'react-native';

/**
 * Hook for managing ScrollView state and functionality
 * @returns Utilities for working with scroll
 */
export const useScrollControl = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  /**
   * Scrolls to the top with error handling
   */
  const scrollToTop = () => {
    Keyboard.dismiss();

    // Ensure scroll is enabled
    setScrollEnabled(true);

    // Small delay to allow components to update
    setTimeout(() => {
      try {
        scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
      } catch (error) {
        console.error('Failed to scroll to top:', error);
      }
    }, 200);
  };

  /**
   * Handler for scroll end
   */
  const handleScrollEnd = () => {
    if (!scrollEnabled) {
      setScrollEnabled(true);
    }
  };

  return {
    scrollViewRef,
    scrollEnabled,
    setScrollEnabled,
    scrollToTop,
    handleScrollEnd,
  };
};
