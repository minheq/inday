import React from 'react';

interface ButtonProps {
  onPress: () => void;
  children?: React.ReactNode;
  style?: any;
}

export function Button(props: ButtonProps) {
  const { onPress, children, style = {} } = props;

  return (
    <span
      onMouseDown={(event) => {
        event.preventDefault();
        onPress();
      }}
      style={style}
    >
      {children}
    </span>
  );
}
