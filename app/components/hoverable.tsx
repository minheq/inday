import React from 'react';
import { isHoverEnabled } from '../utils/execution_environment';

interface HoverableProps {
  children?: React.ReactNode | ((isHovered: boolean) => React.ReactNode);
  onHoverIn?: () => void;
  onHoverOut?: () => void;
}

export function Hoverable(props: HoverableProps) {
  const { children, onHoverIn = () => {}, onHoverOut = () => {} } = props;

  const [showHover, setShowHover] = React.useState(true);
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseEnter = React.useCallback(() => {
    if (isHoverEnabled() && !isHovered) {
      onHoverIn();
      setIsHovered(true);
    }
  }, [onHoverIn, isHovered]);

  const handleMouseLeave = React.useCallback(() => {
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

  const child =
    typeof children === 'function'
      ? children(showHover && isHovered)
      : children;

  return React.cloneElement(React.Children.only(child), {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    // prevent hover showing while responder
    onResponderGrant: handleGrant,
    onResponderRelease: handleRelease,
    // if child is Touchable
    onPressIn: handleGrant,
    onPressOut: handleRelease,
  });
}
