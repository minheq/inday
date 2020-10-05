import React from 'react';
import {
  Animated,
  ViewStyle,
  StyleProp,
  GestureResponderEvent,
} from 'react-native';
import { Pressable, StateCallback } from './pressable';
import { useTheme, tokens } from './theme';
import { Container } from './container';
import { Row } from './row';
import { Icon, IconName } from './icon';
import { Spacer } from './spacer';
import { Text } from './text';

type ButtonState = 'default' | 'hovered' | 'active' | 'disabled';

type ButtonTitleAlignment = 'left' | 'center' | 'right';

interface ButtonProps {
  onPress?: (e: GestureResponderEvent) => void;
  disabled?: boolean;
  state?: ButtonState;
  radius?: number;
  title?: string;
  iconTitle?: IconName;
  iconBefore?: IconName;
  alignTitle?: ButtonTitleAlignment;
  style?:
    | Animated.WithAnimatedValue<StyleProp<ViewStyle>>
    | ((
        props: StateCallback,
      ) => Animated.WithAnimatedValue<StyleProp<ViewStyle>>);
}

export function Button(props: ButtonProps) {
  const {
    onPress = () => {},
    state,
    style,
    title,
    iconTitle,
    alignTitle = 'center',
    iconBefore,
    radius = tokens.radius,
  } = props;
  const background = React.useRef(new Animated.Value(0)).current;
  const theme = useTheme();

  return (
    <Pressable
      disabled={state === 'disabled'}
      style={({ pressed, hovered }) => {
        let toValue = 0;

        if (state === 'active') {
          toValue = 2;
        } else if (state === 'hovered') {
          toValue = 0.5;
        } else if (pressed === true) {
          toValue = 1;
        } else if (hovered === true) {
          toValue = 0.5;
        }

        Animated.spring(background, {
          toValue,
          useNativeDriver: false,
          bounciness: 0,
        }).start();

        return [
          {
            borderRadius: radius,
            backgroundColor: background.interpolate({
              inputRange: [0, 0.5, 1, 2],
              outputRange: [
                theme.button.backgroundDefault,
                theme.button.backgroundHovered,
                theme.button.backgroundPressed,
                theme.button.backgroundActive,
              ],
            }),
          },
          style,
        ];
      }}
      onPress={onPress}
    >
      <Container center height={40} paddingHorizontal={16}>
        <Row
          expanded
          alignItems="center"
          justifyContent={alignmentToJustifyContent(alignTitle)}
        >
          {iconBefore && (
            <>
              <Icon name={iconBefore} size="lg" />
              <Spacer size={8} />
            </>
          )}
          {title && <Text>{title}</Text>}
          {iconTitle && <Icon name={iconTitle} size="xl" />}
        </Row>
      </Container>
    </Pressable>
  );
}

function alignmentToJustifyContent(
  alignTitle: ButtonTitleAlignment,
): 'center' | 'flex-start' | 'flex-end' | 'space-between' {
  switch (alignTitle) {
    case 'left':
      return 'flex-start';
    case 'right':
      return 'flex-end';
    default:
      return 'center';
  }
}
