import React from 'react';

interface UseFocusableProps {
  children?: React.ReactNode | ((isHovered: boolean) => React.ReactNode);
  onFocus?: () => void;
  onBlur?: () => void;
}

export function useFocusable(props: UseFocusableProps = {}) {
  const { onFocus = () => {}, onBlur = () => {} } = props;

  const [isFocused, setIsFocused] = React.useState(false);

  const handleBlur = React.useCallback(() => {
    setIsFocused(false);
    onBlur();
  }, [onBlur]);

  const handleFocus = React.useCallback(() => {
    setIsFocused(true);
    onFocus();
  }, [onFocus]);

  return {
    onBlur: handleBlur,
    onFocus: handleFocus,
    isFocused,
  };
}
