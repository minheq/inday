import React from 'react';
import { isHoverEnabled } from '../utils/execution_environment';

export interface UseHoverableProps {
  onHoverIn?: () => void;
  onHoverOut?: () => void;
}

export function useHoverable(props: UseHoverableProps = {}) {
  const { onHoverIn = () => {}, onHoverOut = () => {} } = props;

  const [showHover, setShowHover] = React.useState(true);
  const [isHovered, setIsHovered] = React.useState(false);

  const handleHoverIn = React.useCallback(() => {
    if (isHoverEnabled() && !isHovered) {
      onHoverIn();
      setIsHovered(true);
    }
  }, [onHoverIn, isHovered]);

  const handleHoverOut = React.useCallback(() => {
    if (isHovered) {
      onHoverOut();
      setIsHovered(false);
    }
  }, [onHoverOut, isHovered]);

  const handleGrant = React.useCallback(() => {
    setShowHover(false);
  }, []);

  const handleRelease = React.useCallback(() => {
    setShowHover(true);
  }, []);

  return {
    onHoverIn: handleHoverIn,
    onHoverOut: handleHoverOut,
    onPressIn: handleGrant,
    onPressOut: handleRelease,
    isHovered: showHover && isHovered,
  };
}
