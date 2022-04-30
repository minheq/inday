import React, { Fragment } from "react";
import { View, StyleSheet } from "react-native";
import { ContainerProvider } from "./container";
import { Spacer } from "./spacer";

interface RowProps {
  flex?: number;
  children?: React.ReactNode;
  justifyContent?: "flex-start" | "flex-end" | "space-between" | "center";
  alignItems?: "flex-start" | "flex-end" | "center";
  spacing?: number;
}

/**
 * Displays its children in a horizontal array.
 */
export function Row(props: RowProps): JSX.Element {
  const { children, flex, justifyContent, alignItems, spacing } = props;

  return (
    <ContainerProvider direction="row">
      <View
        style={[
          styles.root,
          {
            justifyContent,
            alignItems,
            flex,
          },
        ]}
      >
        {React.Children.map(children, (child) => (
          <Fragment>
            {child}
            {child !== null && spacing !== 0 && spacing !== undefined && (
              <Spacer size={spacing} />
            )}
          </Fragment>
        ))}
      </View>
    </ContainerProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    display: "flex",
    flexDirection: "row",
  },
});
