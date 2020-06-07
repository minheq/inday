import React from 'react';
import { View } from 'react-native';
import { useHoverable, UseHoverableProps } from '../hooks/use_hoverable';

interface HoverableProps extends UseHoverableProps {
  children?: React.ReactNode | ((hovered: boolean) => React.ReactNode);
}

export function Hoverable(props: HoverableProps) {
  const {
    onHoverIn: propOnHoverIn,
    onHoverOut: propOnHoverOut,
    children,
  } = props;
  const { onHoverIn, onHoverOut } = useHoverable({
    onHoverIn: propOnHoverIn,
    onHoverOut: propOnHoverOut,
  });

  return (
    // @ts-ignore
    <View onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}>
      {children}
    </View>
  );
}
