import React, { Fragment, useEffect } from 'react';

interface HoverProps {
  hovered: boolean;
  onHoverChange: (hovered: boolean) => void;
}

// https://github.com/necolas/react-native-web/issues/1804
export function Hover(props: HoverProps): JSX.Element {
  const { hovered, onHoverChange } = props;

  useEffect(() => {
    onHoverChange(hovered);
  }, [hovered, onHoverChange]);

  return <Fragment />;
}
