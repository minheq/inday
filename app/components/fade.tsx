import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { SpringConfig } from "./animation";
import { tokens } from "./tokens";

interface FadeProps {
  children?: React.ReactNode;
  config?: SpringConfig;
}

export function Fade(props: FadeProps): JSX.Element {
  const { children, config } = props;
  const { bounciness, speed } = config || tokens.animation.default;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(opacity, {
      toValue: 1,
      bounciness,
      speed,
      useNativeDriver: false,
    }).start();
  }, [opacity, bounciness, speed]);

  return <Animated.View style={{ opacity }}>{children}</Animated.View>;
}
