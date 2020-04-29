import React from "react";

interface StackProps {
  children?: React.ReactNode;
  testID?: string;
}

/**
 * Positions its children relative to the edges of its box.
 * Use [Positioned] component to place as children.
 */
export function Stack(props: StackProps) {
  const { children, testID } = props;

  return (
    <div
      data-component="Stack"
      data-testid={testID}
      style={{
        position: "relative",
      }}
    >
      {children}
    </div>
  );
}
