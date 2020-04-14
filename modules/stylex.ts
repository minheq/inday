import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';

type Style = ViewStyle | TextStyle | ImageStyle;

export const stylex = (...styles: { [key: string]: Style }[]): Style => {
  return Object.assign({}, ...styles);
};

stylex.create = <P extends StyleObject>(styleObject: P) => {
  const stylesheet = StyleSheet.create(styleObject);

  return (...keys: (keyof P | false | undefined)[]): Style[] => {
    let styles = [];

    for (const key of keys) {
      if (key === false || key === undefined) {
        continue;
      }

      styles.push(stylesheet[key]);
    }

    return styles;
  };
};

interface StyleObject {
  [key: string]: Style;
}
